'use strict';

console.log("[+] Simple UnCrackable2 bypass loaded");

/*
  Small compatible export finder for Frida 17+
*/
function findExport(name) {
    try {
        if (typeof Module.findGlobalExportByName === "function") {
            return Module.findGlobalExportByName(name);
        }
    } catch (e) {}

    try {
        if (typeof Module.findExportByName === "function") {
            return Module.findExportByName(null, name);
        }
    } catch (e) {}

    try {
        return Module.getGlobalExportByName(name);
    } catch (e) {}

    try {
        return Process.getModuleByName("libc.so").getExportByName(name);
    } catch (e) {}

    return null;
}

/*
  Block native process-killing functions.
*/
function blockNativeExit(name, retType, argTypes) {
    var addr = findExport(name);

    if (addr === null) {
        console.log("[-] Native function not found: " + name);
        return;
    }

    Interceptor.replace(addr, new NativeCallback(function () {
        console.log("[+] Blocked native " + name);
        if (retType === "int" || retType === "long") {
            return 0;
        }
    }, retType, argTypes));

    console.log("[+] Hooked native " + name);
}

blockNativeExit("exit", "void", ["int"]);
blockNativeExit("_exit", "void", ["int"]);
blockNativeExit("abort", "void", []);
blockNativeExit("kill", "int", ["int", "int"]);
blockNativeExit("tgkill", "int", ["int", "int", "int"]);
blockNativeExit("raise", "int", ["int"]);

Java.perform(function () {

    console.log("[+] Java hooks started");

    /*
      Stop Java exits
    */
    try {
        var System = Java.use("java.lang.System");

        System.exit.overload("int").implementation = function (code) {
            console.log("[+] Blocked System.exit(" + code + ")");
            return;
        };

        console.log("[+] System.exit hooked");
    } catch (e) {
        console.log("[-] System.exit hook failed: " + e);
    }

    try {
        var Process = Java.use("android.os.Process");

        Process.killProcess.implementation = function (pid) {
            console.log("[+] Blocked Process.killProcess(" + pid + ")");
            return;
        };

        console.log("[+] Process.killProcess hooked");
    } catch (e) {
        console.log("[-] Process.killProcess hook failed: " + e);
    }

    /*
      Hide root files
    */
    try {
        var File = Java.use("java.io.File");
        var exists = File.exists.overload();

        exists.implementation = function () {
            var path = this.getAbsolutePath().toString();

            if (
                path.indexOf("/system/bin/su") !== -1 ||
                path.indexOf("/system/xbin/su") !== -1 ||
                path.indexOf("/system/app/Superuser.apk") !== -1 ||
                path.indexOf("/system/app/SuperSU.apk") !== -1 ||
                path.indexOf("/system/xbin/daemonsu") !== -1 ||
                path.indexOf("/system/bin/.ext/.su") !== -1 ||
                path.indexOf("busybox") !== -1 ||
                path.indexOf("magisk") !== -1
            ) {
                console.log("[+] Hidden root file: " + path);
                return false;
            }

            return exists.call(this);
        };

        console.log("[+] File.exists hooked");
    } catch (e) {
        console.log("[-] File.exists hook failed: " + e);
    }

    /*
      Change test-keys to release-keys
    */
    try {
        var Build = Java.use("android.os.Build");
        Build.TAGS.value = "release-keys";
        console.log("[+] Build.TAGS changed to release-keys");
    } catch (e) {
        console.log("[-] Build.TAGS hook failed: " + e);
    }

    /*
      Block root warning dialog.
      Your APK package is owasp.mstg.uncrackable2,
      but some classes may still use sg.vantagepoint.
    */
    var mainActivities = [
        "owasp.mstg.uncrackable2.MainActivity",
        "sg.vantagepoint.uncrackable2.MainActivity"
    ];

    mainActivities.forEach(function (className) {
        try {
            var MainActivity = Java.use(className);

            MainActivity.a.overload("java.lang.String").implementation = function (msg) {
                console.log("[+] Blocked root alert from " + className + ": " + msg);
                return;
            };

            console.log("[+] Hooked alert method in " + className);
        } catch (e) {
            console.log("[-] Could not hook " + className);
        }
    });

    /*
      Force password/code check to true.
    */
    var codeChecks = [
        "owasp.mstg.uncrackable2.CodeCheck",
        "sg.vantagepoint.uncrackable2.CodeCheck"
    ];

    codeChecks.forEach(function (className) {
        try {
            var CodeCheck = Java.use(className);

            CodeCheck.a.overload("java.lang.String").implementation = function (input) {
                console.log("[+] Password check bypassed. Input was: " + input);
                return true;
            };

            console.log("[+] Hooked CodeCheck in " + className);
        } catch (e) {
            console.log("[-] Could not hook " + className);
        }
    });

    console.log("[+] Simple bypass ready");
});
