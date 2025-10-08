#!/usr/bin/env python3
"""
pytree.py - Python Project Tree Visualizer
A clean way to visualize project structures with smart folder exclusion.
"""

import os
import sys
from pathlib import Path

def print_tree(directory, prefix="", is_last=True, exclude_dirs=None, show_hidden=False, max_depth=None, current_depth=0):
    """
    Print directory tree structure with exclusion options
    
    Args:
        directory: Path to the directory
        prefix: Prefix for current level (for recursion)
        is_last: Whether this is the last item in parent directory
        exclude_dirs: List of directory names to exclude
        show_hidden: Whether to show hidden files/folders
        max_depth: Maximum depth to traverse (None for unlimited)
        current_depth: Current depth level (for recursion)
    """
    if exclude_dirs is None:
        exclude_dirs = ['node_modules', '.vscode', '.git', '__pycache__', '.idea', 'venv', 'env', 'dist', 'build']
    
    name = os.path.basename(directory)
    
    # Skip hidden and excluded items
    if not show_hidden and name.startswith('.'):
        return
    if name in exclude_dirs:
        return
    
    # Print current item
    connector = "└── " if is_last else "├── "
    print(prefix + connector + name)
    
    # Stop if max depth reached
    if max_depth and current_depth >= max_depth:
        return
    
    # Process directory contents
    if os.path.isdir(directory):
        prefix += "    " if is_last else "│   "
        
        try:
            # Separate folders and files
            folders = []
            files = []
            
            for item in os.listdir(directory):
                item_path = os.path.join(directory, item)
                
                # Skip hidden items if not showing hidden
                if not show_hidden and item.startswith('.'):
                    continue
                
                # Skip excluded directories
                if os.path.isdir(item_path) and item in exclude_dirs:
                    continue
                
                # Categorize as folder or file
                if os.path.isdir(item_path):
                    folders.append(item)
                else:
                    files.append(item)
            
            # Sort both lists
            folders.sort()
            files.sort()
            
            # Combine: folders first, then files
            all_items = folders + files
            folder_count = len(folders)
            
            # Process each item
            for i, item in enumerate(all_items):
                item_path = os.path.join(directory, item)
                is_last_item = (i == len(all_items) - 1)
                
                # For visual separation between folders and files
                if i == folder_count and folder_count > 0 and len(files) > 0:
                    # Add a visual separator if we have both folders and files
                    if prefix:
                        print(prefix + "│")
                
                print_tree(item_path, prefix, is_last_item, exclude_dirs, 
                          show_hidden, max_depth, current_depth + 1)
                          
        except PermissionError:
            print(prefix + "└── [Permission Denied]")

def quick_print(folder_path, extra_excludes=None, max_depth=None):
    """Quick print without user interaction"""
    if extra_excludes is None:
        extra_excludes = []
    
    default_excludes = ['node_modules', '.vscode', '.git', '__pycache__', '.idea', 'venv', 'env', 'dist', 'build']
    exclude_dirs = default_excludes + extra_excludes
    
    print(f"📂 Project Structure: {folder_path}")
    print("=" * 50)
    print_tree(folder_path, exclude_dirs=exclude_dirs, max_depth=max_depth)

def main():
    """Main function with user-friendly interface"""
    print("🐍 pytree - Python Project Tree Visualizer")
    print("=" * 50)
    print(f"Current directory: {os.getcwd()}")
    print()
    
    # Show current directory contents
    try:
        current_items = [item for item in os.listdir('.') if not item.startswith('.')]
        if current_items:
            # Separate folders and files for display too
            folders = [item for item in current_items if os.path.isdir(item)]
            files = [item for item in current_items if not os.path.isdir(item)]
            
            print("Items in current directory (folders first):")
            for item in sorted(folders):
                print(f"  📁 {item}")
            for item in sorted(files):
                print(f"  📄 {item}")
            print()
    except PermissionError:
        pass
    
    # Get project path
    project_input = input("Enter project folder path (relative or absolute, press Enter for current): ").strip()
    project_path = os.path.abspath(project_input) if project_input else os.getcwd()
    
    if not os.path.exists(project_path):
        print(f"❌ Error: Path '{project_path}' does not exist!")
        return
    
    # Get configuration options
    default_excludes = ['node_modules', '.vscode', '.git', '__pycache__', '.idea', 'venv', 'env', 'dist', 'build']
    
    print(f"Default excluded folders: {', '.join(default_excludes)}")
    exclude_option = input("Add more folders to exclude (comma-separated, or press Enter to keep default): ").strip()
    
    exclude_dirs = default_excludes + [exclude.strip() for exclude in exclude_option.split(',')] if exclude_option else default_excludes
    
    show_hidden = input("Show hidden files/folders? (y/N): ").strip().lower() == 'y'
    
    max_depth_input = input("Max depth (press Enter for unlimited): ").strip()
    max_depth = int(max_depth_input) if max_depth_input.isdigit() else None
    
    print()
    print("=" * 60)
    print_tree(project_path, exclude_dirs=exclude_dirs, show_hidden=show_hidden, max_depth=max_depth)

if __name__ == "__main__":
    main()