﻿using Microsoft.Web.WebView2.Core;
using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using System.Runtime.InteropServices;
using Windows.UI.ViewManagement;
using Windows.Gaming.Input;
using Windows.System;
using Windows.Storage;
using Windows.ApplicationModel;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace OozaruXbox
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private bool _ready = false;

        static private string ConvertVirtualKeyToJS(VirtualKey key)
        {
            switch (key)
            {
                case VirtualKey.Left: return "ArrowLeft";
                case VirtualKey.Right: return "ArrowRight";
                case VirtualKey.Down: return "ArrowDown";
                case VirtualKey.Up: return "ArrowUp";
                case VirtualKey.Back: return "Backspace";
                case VirtualKey.Delete: return "Delete";
                case VirtualKey.End: return "End";
                case VirtualKey.Enter: return "Enter";
                case VirtualKey.Escape: return "Escape";
                case VirtualKey.F1: return "F1";
                case VirtualKey.F2: return "F2";
                case VirtualKey.F3: return "F3";
                case VirtualKey.F4: return "F4";
                case VirtualKey.F5: return "F5";
                case VirtualKey.F6: return "F6";
                case VirtualKey.F7: return "F7";
                case VirtualKey.F8: return "F8";
                case VirtualKey.F9: return "F9";
                case VirtualKey.F10: return "F10";
                case VirtualKey.F11: return "F11";
                case VirtualKey.F12: return "F12";
                case VirtualKey.Home: return "Home";
                case VirtualKey.Insert: return "Insert";
                case VirtualKey.PageDown: return "PageDown";
                case VirtualKey.PageUp: return "PageUp";
                case VirtualKey.Tab: return "Tab";
                case VirtualKey.Shift: return "ShiftLeft";
                case VirtualKey.Control: return "ControlLeft";
                case VirtualKey.Menu: return "AltLeft";
                default: return null;
            }
        }

        static private string ConvertStringToJS(char value)
        {
            switch (value)
            {
                case '`': return "Backquote";
                case '\\': return "Backslash";
                case '[': return "BracketLeft";
                case ']': return "BracketRight";
                case ',': return "Comma'";
                case '0': return "Digit0";
                case '1': return "Digit1";
                case '2': return "Digit2";
                case '3': return "Digit3";
                case '4': return "Digit4";
                case '5': return "Digit5";
                case '6': return "Digit6";
                case '7': return "Digit7";
                case '8': return "Digit8";
                case '9': return "Digit9";
                case '=': return "Equal";
                case 'a': return "KeyA";
                case 'b': return "KeyB";
                case 'c': return "KeyC";
                case 'd': return "KeyD";
                case 'e': return "KeyE";
                case 'f': return "KeyF";
                case 'g': return "KeyG";
                case 'h': return "KeyH";
                case 'i': return "KeyI";
                case 'j': return "KeyJ";
                case 'k': return "KeyK";
                case 'l': return "KeyL";
                case 'm': return "KeyM";
                case 'n': return "KeyN";
                case 'o': return "KeyO";
                case 'p': return "KeyP";
                case 'q': return "KeyQ";
                case 'r': return "KeyR";
                case 's': return "KeyS";
                case 't': return "KeyT";
                case 'u': return "KeyU";
                case 'v': return "KeyV";
                case 'w': return "KeyW";
                case 'x': return "KeyX";
                case 'y': return "KeyY";
                case 'z': return "KeyZ";
                case '-': return "Minus";
                case '.': return "Period";
                case '\'': return "Quote";
                case ';': return "Semicolon";
                case '/': return "Slash";
                case ' ': return "Space";
                default: return null;
            }
        }

        public MainPage()
        {
            //ApplicationView.PreferredLaunchWindowingMode = ApplicationViewWindowingMode.FullScreen;
            ApplicationView.PreferredLaunchViewSize = new Size(1920, 1080);
            ApplicationView.PreferredLaunchWindowingMode = ApplicationViewWindowingMode.PreferredLaunchViewSize;
            Environment.SetEnvironmentVariable(
                variable: "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
                value: "--autoplay-policy=no-user-gesture-required"
            );
            InitializeComponent();

            #pragma warning disable 4014
            InitWebView();
        }

        private async Task InitWebView()
        {
            // Wait for initialization.
            await WebView2.EnsureCoreWebView2Async();

            // Map oozaru folder to hostname.
            WebView2.CoreWebView2.SetVirtualHostNameToFolderMapping(
                hostName: "oozaru",
                folderPath: "Assets\\oozaru",
                accessKind: CoreWebView2HostResourceAccessKind.Allow
            );

            // Handle messages received from WebView2.
            WebView2.CoreWebView2.WebMessageReceived += async (s, e) =>
            {
                var msg = e.TryGetWebMessageAsString();
                if (msg.Contains("Event:"))
                {
                    msg = msg.Replace("Event:", "");
                    switch(msg)
                    {
                        // Game loaded event.
                        case "GameLoaded":
                            Debug.WriteLine("Event: GameLoaded");
                            _ready = true;
                            break;
                    }
                }

                // DirectoryStream
                else if (msg.Contains("DirectoryHelper:"))
                {
                    msg = msg.Replace("DirectoryHelper:", "");
                    StorageFolder folder = await getFolder(msg);
                    IReadOnlyList<IStorageItem> items = await folder.GetItemsAsync();
                    string result = "[";
                    foreach (IStorageItem item in items)
                    {
                        result += "{";
                        result += "isDirectory:" + (item.Name.Contains('.') ? "false" : "true") + ',';
                        result += "fileName:\"" + item.Name + "\",";
                        result += "fullPath:\"" + msg.TrimEnd(['/']) + "/" + item.Name + "\",";
                        result += "extension:" + getExtension(item.Name);
                        result += "},";
                    }
                    result = result.TrimEnd([',']);
                    result += "]";
                    WebView2.CoreWebView2.ExecuteScriptAsync("DirectoryHelperDropbox[\"" + msg + "\"](" + result + ")");
                }

                // File.Exists
                else if (msg.Contains("FileExistsHelper:"))
                {
                    msg = msg.Replace("FileExistsHelper:", "");
                    StorageFolder folder = await getFolder(Path.GetDirectoryName(msg));
                    bool result = await folder.TryGetItemAsync(Path.GetFileName(msg)) != null;
                    WebView2.CoreWebView2.ExecuteScriptAsync("FileExistsHelperDropbox[\"" + msg + "\"](" + (result ? "true" : "false") + ")");
                }

                // Debug print.
                else Debug.WriteLine(msg.Replace("http://oozaru", "Assets/oozaru"));
            };

            // Navigate to oozaru start page.
            WebView2.CoreWebView2.Navigate("http://oozaru/index.html");
        }

        private static string getExtension(string path)
        {
            if (!path.Contains('.')) return null;
            string[] parts = path.Split('.');
            return "\"." + parts[^1] + "\"";
        }

        private static async Task<StorageFolder> getFolder(string path)
        {
            path = path.Replace("/", "\\");
            if (path.Contains('@'))
            {
                path = path.Replace("@", "Assets\\oozaru\\dist");
                return await Package.Current.InstalledLocation.GetFolderAsync(path);
            }
            else
            {
                path = path.Replace("~/", "").Replace("~", "");
                return path == "" ? ApplicationData.Current.LocalFolder : await ApplicationData.Current.LocalFolder.GetFolderAsync(path);
            }
        }

        private void Grid_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (_ready)
            {
                var JSChar = ConvertVirtualKeyToJS(e.Key);
                if (JSChar != null)
                    WebView2.CoreWebView2.ExecuteScriptAsync(@"
                        document.getElementById(""screen"").dispatchEvent(
                            new KeyboardEvent(""keydown"", { code: """ + JSChar + @""" })
                        )
                    ");
            }
        }

        private void Grid_CharacterReceived(UIElement sender, CharacterReceivedRoutedEventArgs args)
        {
            if (_ready && !System.Char.IsControl(args.Character))
            {
                var JSString = "";
                var JSChar = ConvertStringToJS(args.Character);
                if (JSChar != null)
                    JSString += @"
                        document.getElementById(""screen"").dispatchEvent(
                            new KeyboardEvent(""keydown"", { code: """ + JSChar + @""" })
                        )
                    ";
                WebView2.CoreWebView2.ExecuteScriptAsync(
                    JSString + 
                    "charQueue.push('" + (args.Character == '\'' ? "\\" : "") + args.Character + "')"
                );
            }
        }
    }
}
