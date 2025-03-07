import os
import json
import random
import time
import subprocess
import openai
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Load configuration
CONFIG_FILE = "config.json"
with open(CONFIG_FILE, "r") as file:
    config = json.load(file)

# Set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def clone_repo(repo_name: str, repo_url: str):
    """Clones the repo if not already cloned."""
    if not os.path.exists(repo_name):
        print(f"Cloning repository {repo_name}...")
        subprocess.run(["git", "clone", repo_url, repo_name], check=True)
    else:
        print(f"Repository {repo_name} already exists.")

def strip_code_fences(generated_text: str) -> str:
    """
    Removes triple backticks and leftover single backticks
    so the code has no markdown formatting.
    Also removes any leading 'python' prefix.
    """
    if "```" in generated_text:
        parts = generated_text.split("```")
        # Take the first code block if multiple
        if len(parts) > 1:
            code = parts[1]
        else:
            code = parts[0]
    else:
        code = generated_text

    code = code.replace("`", "").strip()

    # If code starts with "python" (common in markdown), remove it
    if code.lower().startswith("python"):
        code = code[6:].strip()

    return code

def generate_code(folder: str, extension: str) -> str:
    """
    Calls GPT to generate a more detailed, functional code snippet
    with no comments or explanations, specific to the folder context.
    """
    prompt = (
        f"Generate a detailed, functional code snippet for a feature in the '{folder}' folder. "
        f"Output only code for a '{extension}' file with no comments or explanations. "
        f"Ensure it demonstrates some real logic or functionality."
    )
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[{"role": "user", "content": prompt}]
    )
    raw_text = response.choices[0].message.content
    return strip_code_fences(raw_text)

def generate_filename_from_code(code_snippet: str, naming_convention: str, extension: str) -> str:
    """
    Uses GPT to produce a short 2-3 word filename *based on the code content*,
    then applies the chosen naming convention (snake_case, camelCase, kebab-case),
    and appends the file extension.
    Avoids repetitive words like 'data', 'tool', 'process', etc.
    """
    filename_prompt = (
        "You are given a code snippet. Read it and produce a short, human-like filename (2-3 words) "
        "that reflects its functionality or purpose. Avoid words like 'data', 'tool', 'process', 'manager', 'script'. "
        "No disclaimers or references to GPT. Return only the filename words.\n\n"
        f"Code snippet:\n{code_snippet}\n\n"
        "Now output just the 2-3 word filename, no punctuation or disclaimers. "
        f"Naming convention: {naming_convention}."
    )

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[{"role": "user", "content": filename_prompt}]
    )
    raw_filename = response.choices[0].message.content.strip()
    raw_filename = raw_filename.replace("`", "").replace("```", "")

    # Minimal cleanup (remove non-alphanumeric except underscores/dashes)
    cleaned = "".join(ch for ch in raw_filename if ch.isalnum() or ch in ["_", "-"])

    if naming_convention == "snake_case":
        # Convert leftover dashes to underscores and make lowercase
        cleaned = cleaned.replace("-", "_").lower()
    elif naming_convention == "camelCase":
        # Convert underscores/dashes to minimal camelCase
        parts = cleaned.replace("-", "_").split("_")
        if len(parts) > 1:
            cleaned = parts[0].lower() + "".join(word.capitalize() for word in parts[1:])
        else:
            cleaned = cleaned[0].lower() + cleaned[1:] if cleaned else "file"
    elif naming_convention == "kebab-case":
        # Convert underscores to dashes, make lowercase
        cleaned = cleaned.replace("_", "-").lower()
    else:
        # Fallback if unknown convention
        cleaned = cleaned.lower()

    if not cleaned:
        cleaned = "file"

    return f"{cleaned}{extension}"

def generate_commit_message_from_code(code: str) -> str:
    """
    Uses GPT to generate a more humanized, unique commit message based on the code content.
    Avoid repetitive patterns like 'added...' or 'implemented...'.
    """
    commit_prompt = (
        "Analyze the following code snippet and create a unique, human-sounding Git commit message. "
        "Avoid phrases like 'added' or 'implemented' at the start. "
        "Keep it under 15 words, no disclaimers or GPT references.\n\n"
        f"{code}"
    )
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[{"role": "user", "content": commit_prompt}]
    )
    commit_message = response.choices[0].message.content.strip()
    commit_message = commit_message.replace("`", "").replace("```", "")
    return commit_message

def commit_and_push(repo_name: str, commit_message: str):
    """Stages, commits, and pushes changes to the remote repo."""
    os.chdir(repo_name)
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", commit_message], check=True)
    # Detect current branch (could be 'main', 'master', etc.)
    current_branch = subprocess.check_output(["git", "branch", "--show-current"]).strip().decode("utf-8")
    subprocess.run(["git", "push", "origin", current_branch], check=True)
    os.chdir("..")

def automate_commits(repo_config: dict):
    """
    1) Clones the repo if needed.
    2) Waits until the current time is between 'starting_time' and 'ending_time'.
    3) Performs random commits (between 'minimum_commits' and 'maximum_commits').
    4) Stops if the window closes.
    5) Creates a new file each time with a GPT-generated name derived from the code snippet.
    6) Generates more human-sounding commit messages.
    """
    repo_name = repo_config["name"]
    repo_url = repo_config["repo_url"]

    # Clone if needed
    clone_repo(repo_name, repo_url)
    
    # Parse times (e.g., "05:00 PM" -> datetime.time(17, 0))
    start_time = datetime.strptime(repo_config["starting_time"], "%I:%M %p").time()
    end_time = datetime.strptime(repo_config["ending_time"], "%I:%M %p").time()
    
    # Parse commit limits
    min_commits = int(repo_config["minimum_commits"])
    max_commits = int(repo_config["maximum_commits"])
    
    # Wait until we're within the allowed time window or we've passed it
    while True:
        now = datetime.now().time()
        if start_time <= now <= end_time:
            print(f"We're in the commit window ({repo_config['starting_time']} - {repo_config['ending_time']}).")
            break
        elif now > end_time:
            print(f"We've passed the end time ({repo_config['ending_time']}). Exiting...")
            return
        else:
            print("Not yet in commit window. Sleeping 60s...")
            time.sleep(60)
    
    # Number of commits for this session
    commit_count = random.randint(min_commits, max_commits)

    # Keep track of used filenames in this run to avoid duplicates
    used_filenames = set()

    for _ in range(commit_count):
        # Check if we are still within the time window
        now = datetime.now().time()
        if now > end_time:
            print(f"Reached the end time ({repo_config['ending_time']}). Stopping commits...")
            break
        
        # Pick a random folder
        folder = random.choice(repo_config["folders"])
        directory = os.path.join(repo_name, folder)
        os.makedirs(directory, exist_ok=True)
        
        # Generate code
        code = generate_code(folder, repo_config["file_extension"])
        
        # Generate a new file name from the code snippet, ensure uniqueness in this run
        while True:
            filename = generate_filename_from_code(
                code,
                repo_config["file_naming_convention"],
                repo_config["file_extension"]
            )
            if filename not in used_filenames:
                used_filenames.add(filename)
                break
            # If it's a duplicate, try again

        file_path = os.path.join(directory, filename)
        
        # Write the code to the file
        with open(file_path, "w") as f:
            f.write(code)
        
        # Create a descriptive, humanized commit message
        commit_message = generate_commit_message_from_code(code)
        
        # Commit & push
        commit_and_push(repo_name, commit_message)
        
        # Random sleep between commits (5-15 minutes)
        time.sleep(random.randint(300, 900))

def main():
    """
    Picks a random repository from config.json and runs automate_commits on it.
    """
    repositories = config.get("repositories", [])
    if not repositories:
        print("No repositories found in config.json.")
        return
    
    # Randomly select one repository from config
    chosen_repo = random.choice(repositories)
    automate_commits(chosen_repo)

if __name__ == "__main__":
    main()
