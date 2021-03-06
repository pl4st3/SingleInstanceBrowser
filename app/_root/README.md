# SingleInstanceBrowser

***Important notice:*** No special attempts have been made to make this browser secure 
for web browsing. Both the host window and the loadad pages can use plugins; all other
options are set to their default values. See also 
[Electron BrowserWindow](https://electron.atom.io/docs/api/browser-window/)
and
[Electron &lt;webview&gt; Tag](https://electron.atom.io/docs/api/webview-tag/).
Use at your own risk!

## Installation

Download one of the releases from the [releases](../../../../releases) page, unzip the file and 
copy the resulting directory to any place you like. On the Mac you'd probably just 
copy the `SIB` app (inside the unzipped folder) to `/Applications`.

## GUI Usage

Just double click `SIB` (Mac) or `SIB.exe` (Windows). SingleInstanceBrowser will open 
and show a blank window with an address bar. The address bar is very primitive, don't 
expect the same features you get from regular browsers. All it does is to try to 
auto-complete some URLs but without any sophistication.

Examples:

```
www.idesis.de          =>  http://www.idesis.de  (ok)
HttP://www.idesis.de   =>  http://www.idesis.de  (ok)
http:/www.idesis.de    =>  http:/www.idesis.de   (wrong)

Users/doe/Desktop/SomePDF.pdf   =>  http://users/doe/Desktop/SomePDF.pdf   (wrong)
/Users/doe/Desktop/SomePDF.pdf  =>  file:///Users/doe/Desktop/SomePDF.pdf  (ok)

c:\somedir\SomePDF.pdf          =>  http://c/somedir/SomePDF.pdf    (wrong)
/c:\somedir\SomePDF.pdf         =>  file:///c:/somedir/SomePDF.pdf  (ok)
```

## Command line usage

SingleInstanceBrowser accepts an arbitrary number of command line parameters but only 
the last one is taken as a URL which should be opened. Any other parameters are 
ignored. For the URLs passed the same restrictions/rules as above apply.

**Mac:**

```bash
/Applications/SIB.app/Contents/MacOS/SIB www.idesis.de
/Applications/SIB.app/Contents/MacOS/SIB /Users/doe/Desktop/SomePDF.pdf
```

Starting the executable form inside the app bundle is very unusual but it is one 
way to open multiple instances of an application. But if SingleInstanceBrowser is 
configured to allow only one instance then even starting the executable again won't 
create another instance, instead the URL given via command line will be opened in 
the current running instance.

The recommended way is to use the `open` command:

```bash
open -g -b de.idesis.singleinstancebrowser http://www.idesis.de
open -g -b de.idesis.singleinstancebrowser /Users/doe/Desktop/SomePDF.pdf
```

If you use `open` to navigate to a *web page* you have to enter a complete vaild URL 
(prefixed with `http://` or `https://` but `file://` will also work) otherwise `open` will 
treat the argument as a file name and tell you that it doesn't exist.

The default behaviour of `open` is to prevent multiple instances of an application, but
if you really need it then you can use `open` with `-n`:

```bash
open -n -b de.idesis.singleinstancebrowser http://www.idesis.de
```

However, this does only work, if `SingleInstance` is set to `false` (see below). If it is 
set to `true` the given URL won't be passed to the already running instance.

**Windows:**

The behaviour is the same like on the Mac, but starting SingleInstanceBrowser from 
the command line is straight forward:

```bash
SIB.exe www.idesis.de
SIB.exe /c:\somedir\SomePDF.pdf
```

### Quitting a running instance

You can also quit a running instance via command line (if `SingleInstance` is `true`, see below).

**Mac:**

```bash
/Applications/SIB.app/Contents/MacOS/SIB quit
```

or

```bash
open -g -b de.idesis.singleinstancebrowser http:quit
```

Simply using `quit` here isn't possible because it would be interpreted by the `open` command 
as a file, therefore `http:quit` is used as a pseudo URL to "fool" the `open` command and pass
it through to the running instance. 

**Windows:**

```bash
SIB.exe quit
```

## Configuration

There is only one configuration file:

**Mac:**

```
~/Library/Application Support/de.idesis.singleinstancebrowser/settings.json
```

**Windows:**

```
%APPDATA%\de.idesis.singleinstancebrowser\settings.json
```

At the very first start of SingleInstanceBrowser this file is created from a template
which resides in the following directory:


**Mac:**

```
/Applications/SIB.app/Contents/Resources/app.asar.unpacked/res/settings.json
```

**Windows\*:**

```
c:\Program Files\SIB-x.y.z-win32-x64\resources\app.asar.unpacked\res\settings.json
```

\*Assuming a standard installation in `%ProgramFiles%`.

This default configuration (from the application directory above) looks like this:

```json
{
    "Window": {
        "Left": 50,
        "Top": 50,
        "Width": 1024,
        "Height": 768
    },
    "ShortCuts": {
        "Global": true,
        "ToggleAddressBar": [
            "mod+t"
        ],
        "ToggleInternalDevTools": [
            "mod+shift+d"
        ],
        "ToggleDevTools": [
            "mod+d"
        ],
        "FocusLocationBar": [
            "mod+l"
        ],
        "InternalReload": [
            "mod+shift+r",
            "shift+f5"
        ],
        "Reload": [
            "mod+r",
            "f5"
        ],
        "GoBack": [
            "ctrl+alt+left"
        ],
        "GoForward": [
            "ctrl+alt+right"
        ],
        "ExitHTMLFullscreen": [
            "esc"
        ],
        "ToggleWin32Menu": [
            "ctrl+h"
        ]
    },
    "UserAgent": "",
    "Permissions": [
        "fullscreen"
    ],
    "AllowPopups": false,
    "AllowNewWindows": true,
    "ClearTraces": false,
    "SingleInstance": true,
    "FocusOnNewURL": true,
    "HardwareAcceleration": true,
    "ContentProtection": false,
    "Win32MenuState": 1,
    "Homepage": ""
}
```

These are also the default values for every property in case of a malformed JSON file 
or if any of the values is invalid, missing or has the wrong type.

If you want to prepare a deplyoment on multiple machines in an organization you can
install a copy of SingleInstanceBrowser on your machine, adjust the settings to your 
needs and then deploy this copy to the target machines. On the target machines these
settings will be used then as the initial default settings.

- The `Window` object configures the initial window position and size when 
  SingleInstanceBrowser is started. 

- The `ShortCuts` object configures the available keyboard shortcuts. The value of the `Global` 
  key controls how keyboard shortcuts are enabled/disabled. With `false` all shortcuts are 
  disabled if the URL field in the address bar is focused. With `true` shortcuts are enabled 
  even if the URL field is focused.

  Every entry is an array of strings, so you can assign multiple shortcuts to every command, 
  (see `Reload`). The key `mod` below is mapped to the `Command`-key on the Mac and to the 
  `Ctrl`-key on Windows.

  The term *host window* below means the native window (`Electron.BrowserWindow`), which 
  effectively is also a web page but only contains the `webview` tag which itself contains 
  the actual page. You can open the Chrome developer tools to debug the SingleInstanceBrowser 
  window itself with `mod+shift+d`. To debug the actual web page you'd use `mod+d` instead. 

  Please note that there are also other common keyboard shortcuts in the main menu (for 
  example for Cut, Copy, Paste etc.). Currently these menu shortcuts are not configurable.

  | Key                      | ShortCuts (default)     | Action                                                                   |
  | ------------------------ | ----------------------- | ------------------------------------------------------------------------ |
  | `ToggleAddressBar`       | `mod+t`                 | Show/hide the addressbar.                                                |
  | `ToggleInternalDevTools` | `mod+shift+d`           | Show/hide developer tools for the host window.                           |
  | `ToggleDevTools`         | `mod+d`                 | Show/hide developer tools for the current page.                          |
  | `FocusLocationBar`       | `mod+l`                 | Show addressbar and focus the URL entry field.                           |
  | `InternalReload`         | `mod+shift+r, shift+f5` | Reload the host window.                                                  |
  | `Reload`                 | `mod+r, f5`             | Reload the current page.                                                 |
  | `GoBack`                 | `ctrl+alt+left`         | Go one step back in the browser history.                                 |
  | `GoForward`              | `ctrl+alt+right`        | Go one step forward in the browser history.                              |
  | `ExitHTMLFullscreen`     | `esc`                   | Leave HTML fullscreen (for example from YouTube videos).                 |
  | `ToggleWin32Menu`        | `ctrl+h`                | Show/hide the main menu on Windows platforms (not available on the Mac). |

  If you want to disable a keyboard shortcut set its value to `null` or an empty string (`""`). 
  You can assign your own keyboard shortcuts to any of the keys above. For available key 
  combinations please see the documentation of [Mousetrap](https://craig.is/killing/mice).

- `UserAgent` will be used to set `navigator.userAgent` in the browser window. If this 
  value is missing or an empty string (`""`), the default `navigator.userAgent` from the 
  builtin Chromium engine will be used. You can set this value to any string you like. If 
  you want to prevent a user agent to be sent then set this value to a single space (`" "`).

- `Permissions` is an array of strings which controls the behaviour if a web page asks 
  for a specific permission. The default is to allow fullscreen requests. If you also want
  to allow notifications from web pages the value would be `["fullscreen", "notifications"]`.

- With `AllowPopups` set to `true` the current window can open other popup windows.

- With `AllowNewWindows` set to `true` the current window can open new windows when
  links in the current page want to be opened in new windows/tabs. Setting this to
  `false` can significantly degrade the browsing experience.

- If `ClearTraces` is set to `true` then any temporary data like caches, local storage, 
  cookies etc. will be deleted when SingleInstanceBrowser is closed. Deleting means
  the complete removal of the contents of the following directory:

  **Mac:**

  ```
  ~/Library/Application Support/de.idesis.singleinstancebrowser
  ```

  **Windows:**

  ```
  %APPDATA%\de.idesis.singleinstancebrowser
  ```

  The only exception is the `settings.json` file which is left to keep user settings.

  *Please note*: on Windows the removal of most files/directories currently fails silently 
  due to a bug in the Electron framework. On the Mac some files can also remain, but 
  they don't contain any private data.

- If `SingleInstance` is set to `true` then only one instance of SingleInstanceBrowser
  is allowed (lets call it *A*). If you try to start another instance (*B*), the already 
  running instance *A* will be given the command line parameters from *B* and *B* will
  quit immediately.

- If `FocusOnNewURL` is set to `true` and `SingleInstance` is also `true` then starting
  another instance will cause the already running instance to activate its window and
  make it the forground window (regardless of a given command line URL). Setting this
  value to `false` opens the given URL (if any) in the current instances window (*A*) 
  but it won't be activated.

- On some systems you may encounter graphics artifacts in web pages, in such cases you 
  can try to set `HardwareAcceleration` to `false`.

- Setting `ContentProtection` to `true` prevents screenshots from the browser window. 
  On the Mac a screenshot from the window itself will cause an error message. Even taking 
  a screenshot of the complete desktop won't show anything from SingleInstanceBrowser. 
  On Windows the result contains the window title and borders of SingleInstanceBrowser 
  but the content area will be black.

- `Win32MenuState` sets the behaviour of the main menu on Windows platforms. This
  setting is ignored on the Mac. `0` means that the main menu isn't available at all.
  Setting the value to `1` enables the main menu but doesn't show it on startup (see
  respective shortcut). `2` enables the main menu and shows it on startup. Any other
  value will cause the default setting (`1`) to be used.

- The string in `Homepage` contains the URL to be opened by default if no URL was given
  via command line. `Homepage` is ignored at all if it is an empty string `("")`.


## License

MIT © [idesis GmbH](http://www.idesis.de), Rellinghauser Straße 334F, D-45136 Essen
