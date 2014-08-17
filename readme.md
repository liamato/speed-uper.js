# speed-uper.js

 The easiest way to view the things you can do to speed-up your web

## How to use it

You only need to dowload speed-uper.js, configure it and put that `script` tag on your HTML file.

```html
<script defer src="speed-uper.js"></script>
```

To see the results just open the JS console `F12` on dev tools.


![How it looks](example.min.png)


## What do you need

* A PHP server (for now), to execute serverside.php in ptitions of speed-uper.js

* You must configure the variable serverside on speed-uper.js width the path to the serverside file

## Recommendations

* **You never should put this script in a production server because it slows so much the web charging**

* If you want to use a external server for the backend must activate CORS in that server.

You can do this modifying the `.htaccess` file (if you use apache, obiously), like this:

```
Header add Access-Control-Allow-Origin "The-site-you-want-to-execute-speed-uper.js"
```

* If you want to use a external server for the backend make you sure that the backend server doesn't block your ip for anti DDoS attacks protection

## License

That script was licenced under **_[BSD 3-Clause License](LICENSE)_**