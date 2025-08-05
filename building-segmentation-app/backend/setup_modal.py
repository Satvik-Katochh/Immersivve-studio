#!/usr/bin/env python3
"""
Setup script for Modal.com deployment
"""

import subprocess
import sys
import os

def install_modal():
    """Install Modal CLI"""
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "modal"], check=True)
        print("✅ Modal CLI installed successfully!")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Modal CLI")
        return False
    return True

def setup_modal():
    """Setup Modal.com account"""
    print("🔧 Setting up Modal.com...")
    print("1. You'll need to create a Modal.com account")
    print("2. Install Modal CLI")
    print("3. Authenticate with Modal")
    
    # Install Modal CLI
    if not install_modal():
        return False
    
    # Authenticate
    print("\n🔐 Please authenticate with Modal.com:")
    print("Run: modal token new")
    print("Follow the instructions to create your account and get a token.")
    
    return True

def deploy_to_modal():
    """Deploy the application to Modal"""
    print("🚀 Deploying to Modal.com...")
    
    try:
        # Deploy using Modal
        result = subprocess.run([
            "modal", "deploy", "modal_app.py"
        ], cwd="backend", check=True, capture_output=True, text=True)
        
        print("✅ Deployment successful!")
        print(result.stdout)
        return True
        
    except subprocess.CalledProcessError as e:
        print("❌ Deployment failed!")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("🏗️  Setting up Building Segmentation App for Modal.com")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("backend/modal_app.py"):
        print("❌ Please run this script from the project root directory")
        return
    
    # Setup Modal
    if not setup_modal():
        print("❌ Modal setup failed")
        return
    
    # Deploy
    print("\n" + "=" * 50)
    deploy_choice = input("Do you want to deploy now? (y/n): ").lower()
    
    if deploy_choice == 'y':
        if deploy_to_modal():
            print("\n🎉 Your app is now deployed on Modal.com!")
            print("📝 Next steps:")
            print("1. Get your Modal endpoint URL")
            print("2. Update frontend API configuration")
            print("3. Test the deployment")
        else:
            print("❌ Deployment failed. Please check the errors above.")
    else:
        print("📝 To deploy later, run: modal deploy backend/modal_app.py")

if __name__ == "__main__":
    main() 