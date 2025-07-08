<h1>Unicorn Image Editor</h1>
Repository for Unicorn Image Editor
<h2>React Setup:</h2>
Ensure that NPM and node.js are installed with the following commands:

```
sudo apt-get install nodejs
```

```
sudo apt-get install npm
```
Move to the my-react-app directory.
To install the requirements for the project run:
```
npm install
```
Now that all of the dependencies are installed in node.js, run:
```
npm run dev
```
Once VITE loads up, press o, followed by the Enter key. This should open the app in the browser.

<h2>Firebase Setup</h2>
Ensure you have installed firebase:

```
npm install firebase
```

To log into the firebase-CLI:
```
firebase login
```

To set up the emulators type:
```
firebase init
```
Now follow the prompts to set up what you need.  
It is important to note that you can run this everytime you need to enable a new emulator.  
  
Incase you have attempted to drop an emulator from what you want to use and it does not work:  
Go into the "my-react-app" directory and open the "firebase.json" file.  
In here you can remove the emulators you do not want to use.  
  
To run the emulators:  
```
firebase emulators:start
```

To access our project credentials go to the firebase console:  
gear/settings icon > project settings > General  
Now scroll down to "Your apps"  
Select "unicorn-web"  
Copy the bit of hashmap/dictionary/map from the code that shows up to the right.  
Create a "hidden" directory under the "my-react-app" directory.  
Now create "firebaseConfig.json"  
Paste the copied content into this file and edit it into valid json format.  
Tip: ensure that all the keys have double-quotes (") around them.  

