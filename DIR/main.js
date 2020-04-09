//////declarin a a process to make a windows form isntead of web page /////

const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

///set env if non dev is using

process.env.NODE_ENV = 'production';

///


let mainWindow;
let addWindow; /// adding small windows see function below


// Listen for the app to be ready

app.on('ready', function(){
//create new window
mainWindow = new BrowserWindow({
     /// webpreferences prevents require error on new window
     webPreferences: {
        nodeIntegration: true
        }
});
//load html into window
mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
   
}));


/// quit everything when main window is close
mainWindow.on('closed', function(){
    app.quit();
});

/////

/////This building the menu from the template below
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
// inserting data on menu
///please dont forget to declare Menu on the var in electron above
Menu.setApplicationMenu(mainMenu);
});



/////////////
/// handle create add window for function below
function createAddWindow() {
    addWindow = new BrowserWindow({
      /// webpreferences prevents require error on new window
        webPreferences: {
        nodeIntegration: true
        },
        width: 300,
        height: 200,
        title: 'Add your listing'
    });
    //load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        nodeIntegration: true,
        protocol: 'file:',
        slashes: true,
        sandbox: true
    }));
    
    //garbase collection free ram space when closing the app
    addWindow.on('close', function(){
        addWindow = null;
        });
        


}

/// catch the item add
ipcMain.on('item:add', function(e, item){
    ///testing if we can send the item  console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});



////////////






/////This is the Menu template

const mainMenuTemplate = [
    {
  /// adding menus above and function for submenus including shortcut keys. 
        label: 'file', 
        submenu: [
            {
                label: 'Add Item', 
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'QUIT',
         ///darwin is for mac
         /// explanation if  == to darwin (meaning mac) ? use command+Q else: ctrl+q
                accelerator: process.platform == 'darwin' ? "Command+Q" : 'ctrl+Q',
                click() {
                    app.quit();
                }

            }
        ]
    }
]; 

// if mac, add empty object to menu

if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// add developer tools item if not in prod
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Developer Tools',
                accelerator: process.platform == 'darwin' ? "Command+I" : 'ctrl+i',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
        
                }
            },
            {
                role: 'reload'
            }
            ]
            });
               
}
