﻿module JustinCredible.SampleApp.Services {

    /**
    * Provides a common set of helper/utility methods.
    */
    export class Utilities {

        public static $inject = ["isRipple", "isDebug", "Preferences"];

        private Preferences: Services.Preferences;

        private _isRipple: boolean;
        private _isDebug: boolean;

        constructor(isRipple: boolean, isDebug: boolean, Preferences: Services.Preferences) {
            this._isRipple = isRipple;
            this._isDebug = isDebug;
            this.Preferences = Preferences;
        }

        /**
         * Returns the categories for the application in their default sort order.
         */
        public get categories(): ViewModels.CategoryItemViewModel[]{

            // Define the default set of categories.
            var categories = [
                new ViewModels.CategoryItemViewModel("Category 1", "#/app/category/1", "ios7-pricetags-outline", 0),
                new ViewModels.CategoryItemViewModel("Category 2", "#/app/category/2", "ios7-pricetags-outline", 1),
                new ViewModels.CategoryItemViewModel("Category 3", "#/app/category/3", "ios7-pricetags-outline", 2),
                new ViewModels.CategoryItemViewModel("Category 4", "#/app/category/4", "ios7-pricetags-outline", 3)
            ];

            // If the user has ordering preferences, then apply their custom ordering.
            if (this.Preferences.categoryOrder) {
                this.Preferences.categoryOrder.forEach((categoryName: string, index: number) => {
                    var categoryItem = _.where(categories, { name: categoryName })[0];

                    if (categoryItem) {
                        categoryItem.order = index;
                    }
                });
            }

            // Ensure the list is sorted by the order.
            categories = _.sortBy(categories, "order");

            return categories;
        }

        /**
         * Can be used to determine if this application is being run in the Apache
         * Ripple Emulator, which runs in a desktop browser, and not Cordova.
         * 
         * @ returns True if the application is running in the Ripple emulator, false otherwise.
         */
        public get isRipple(): boolean {
            return this._isRipple;
        }

        /**
         * Can be used to determine if the application is in debug or release mode.
         * 
         * @returns True if the application is in debug mode, false otherwise.
         */
        public get isDebugMode(): boolean {
            return this._isDebug;
        }

        /**
         * Used to check if the current platform is Android.
         */
        public get isAndroid(): boolean {
            return typeof(device) !== "undefined" && device.platform === "Android";
        }

        /**
         * Used to check if the current platform is iOS.
         */
        public get isIos(): boolean {
            return typeof (device) !== "undefined" && device.platform === "iOS";
        }

        /**
         * Used to check if the current platform is Windows Phone 8.x.
         */
        public isWindowsPhone8(): boolean {
            return typeof(device) !== "undefined" && device.platform === "WP8";
        }

        /**
         * Used to check if the current platform is Windows 8 (desktop OS).
         */
        public isWindows8(): boolean {
            return typeof(device) !== "undefined" && device.platform === "Windows8";
        }

        /**
         * Exposes an API for working with the operating system's clipboard.
         */
        get clipboard(): ICordovaClipboardPlugin {
            return cordova.plugins.clipboard;
        }

        /**
         * Used to determine if a string ends with a specified string.
         * 
         * @param str The string to check.
         * @param suffix The value to check for.
         * @returns True if str ends with the gtiven suffix, false otherwise.
         */
        public endsWith(str: string, suffix: string): boolean {

            if (str == null || str === "") {
                return false;
            }

            if (suffix == null || suffix === "") {
                return true;
            }

            return (str.substr(str.length - suffix.length) === suffix);
        }

        /**
         * Used to determine if a string starts with a specified string.
         * 
         * @param str The string to check.
         * @param prefix The value to check for.
         * @returns True if str starts with the given prefix, false otherwise.
         */
        public startsWith(str: string, prefix: string): boolean {

            if (str == null || str === "") {
                return false;
            }

            if (prefix == null || prefix === "") {
                return true;
            }
            return (str.substr(0, prefix.length) === prefix);
        }

        /**
         * Used to morph a string to title-case; that is, any character that
         * is proceeded by a space will be capitalized.
         * 
         * @param str The string to convert to title-case.
         * @returns The title-case version of the string.
         */
        public toTitleCase(str: string): string {

            if (!str) {
                return "";
            }

            // http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
            return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        }

        /**
        * Used to format a string by replacing values with the given arguments.
        * Arguments should be provided in the format of {x} where x is the index
        * of the argument to be replaced corresponding to the arguments given.
        * 
        * For example, the string t = "Hello there {0}, it is {1} to meet you!"
        * used like this: Utilities.format(t, "dude", "nice") would result in:
        * "Hello there dude, it is nice to meet you!".
        * 
        * @param str The string value to use for formatting.
        * @param ... args The values to inject into the format string.
        */
        public format(formatString: string, ...args: any[]): string {
            var i, reg;
            i = 0;

            for (i = 0; i < arguments.length - 1; i += 1) {
                reg = new RegExp("\\{" + i + "\\}", "gm");
                formatString = formatString.replace(reg, arguments[i + 1]);
            }

            return formatString;
        }

        /**
         * Returns a random number between the given minimum and maximum values.
         */
        public getRandomNumber(min: number, max: number): number {
            // http://jsfiddle.net/alanwsmith/GfAhy/
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        /**
         * Used to generate a globally unique identifier in the standard GUID string format.
         * For example: D99A5596-5478-4BAA-9A42-3BC352DC9D56
         * 
         * @returns A GUID in string format.
         */
        public generateGuid() {
            var
                // Will hold the GUID string as we build it.
                guid: string,

                // Used to hold the generated hex digit as they are generated.
                hexDigit: string,

                // Used to keep track of our location in the generated string.
                j: number;

            // Start out with an empty string.
            guid = "";

            // Now loop 35 times to generate 35 characters.
            for (j = 0; j < 32; j++) {

                // Characters at these indexes are always hyphens.
                if (j === 8 || j === 12 || j === 16 || j === 20) {
                    guid = guid + "-";
                }

                // Get a random number between 0 and 16 and convert it to its hexadecimal value.
                hexDigit = Math.floor(Math.random() * 16).toString(16).toUpperCase();

                // Add the digit onto the string.
                guid = guid + hexDigit;
            }

            return guid;
        }

        /**
         * Used to get a value from an object with the given property name.
         * 
         * @param object The object to obtain the value from.
         * @param propertyString A dotted notation string of properties to use to obtain the value.
         * @returns The value specified by the property string from the given object.
         */
        public getValue(object: any, propertyString: string): any {
            var properties: string[],
                property: string,
                i: number;

            if (object == null) {
                return null;
            }

            if (propertyString == null) {
                return null;
            }

            // If the property string was empty, then just return the original object.
            if (propertyString === "") {
                return object;
            }

            // Break the property string down into individual properties.
            properties = propertyString.split(".");

            // Dig down into the object hierarchy using the properties.
            for (i = 0; i < properties.length; i += 1) {
                // Grab the property for this index.
                property = properties[i];

                // Grab the object with this property name.
                object = object[property];

                // If we've hit a null, then we can bail out early.
                if (object == null) {
                    return null;
                }
            }

            // Finally, return the object that we've obtained.
            return object;
        }

        /**
         * Used to obtain a function from the window object using the dotted notation property string.
         * 
         * @param propertyString The dotted notation property string used to obtain the function reference from the window object.
         */
        public getFunction(propertyString: string): () => any;

        /**
         * Used to obtain a function from the given object using the dotted notation property string.
         * 
         * @param obj The object to being the search at.
         * @param propertyString The dotted notation property string used to obtain the function reference from the object.
         */
        public getFunction(obj: any, propertyString: string): () => any;

        /**
         * Used to obtain a function from the given object using the dotted notation property string.
         * 
         * If inferContext is true, then the method will attempt to determine which context the function should be executed in.
         * For example, given the string "something.else.theFunction" where "theFunction" is a function reference, the context
         * would be "something.else". In this case the function returned will be wrapped in a function that will invoke the original
         * function in the correct context. This is most useful for client event strings as passed from the server.
         * 
         * @param objectOrPropertyString The object to being the search at OR a property string (which assumes the object to use is the window object).
         * @param propertyString The dotted notation property string used to obtain the function reference from the object.
         */
        public getFunction(objectOrPropertyString?: any, propertyString?: string): () => any;

        /**
         * Used to obtain a function from the given object using the dotted notation property string.
         * 
         * If inferContext is true, then the method will attempt to determine which context the function should be executed in.
         * For example, given the string "something.else.theFunction" where "theFunction" is a function reference, the context
         * would be "something.else". In this case the function returned will be wrapped in a function that will invoke the original
         * function in the correct context. This is most useful for client event strings as passed from the server.
         * 
         * @param objectOrPropertyString The object to being the search at OR a property string (which assumes the object to use is the window object).
         * @param propertyString The dotted notation property string used to obtain the function reference from the object.
         * @param inferContext Indicates that we should attempt determine the context in which the function should be called.
         */
        public getFunction(objectOrPropertyString?: any, propertyString?: string, inferContext?: boolean): () => any;

        /**
         * Used to obtain a function from the given object using the dotted notation property string.
         * 
         * If inferContext is true, then the method will attempt to determine which context the function should be executed in.
         * For example, given the string "something.else.theFunction" where "theFunction" is a function reference, the context
         * would be "something.else". In this case the function returned will be wrapped in a function that will invoke the original
         * function in the correct context. This is most useful for client event strings as passed from the server. Defaults to true.
         * 
         * @param objectOrPropertyString The object to being the search at OR a property string (which assumes the object to use is the window object).
         * @param propertyString The dotted notation property string used to obtain the function reference from the object.
         * @param inferContext Indicates that we should attempt determine the context in which the function should be called.
         */
        public getFunction(objectOrPropertyString?: any, propertyString?: string, inferContext?: boolean): () => any {
            var scope: any,
                fn: () => any,
                contextPropertyString: string,
                context: any;

            // Default the inferContext variable to true.
            if (inferContext == null) {
                inferContext = true;
            }

            if (typeof (objectOrPropertyString) === "string") {
                // If the first parameter was a string, then we know they used the string only overload.
                // In that case default the scope to be the window object.
                scope = window;
                propertyString = objectOrPropertyString;
            }
            else {
                // Otherwise, treat the first parameter as the scope object.
                scope = objectOrPropertyString;
            }

            // Delegate to the getValue() function to do the work.
            fn = this.getValue(scope, propertyString);

            if (!fn) {
                return null;
            }

            // Now that we've obtained a function reference, lets see if we can find the context to use
            // to invoke the function in. Use the property string all the way up to the last segment.
            // For example, if property string was: something.else.theFunction
            // then the context string would be: something.else
            if (propertyString.indexOf(".") > -1) {
                contextPropertyString = propertyString.substr(0, propertyString.lastIndexOf("."));
            }

            // Now delegate to the getValue() function to do the work.
            context = this.getValue(scope, contextPropertyString);

            // Now that we have a context object, we'll use this underscore helper to wrap the original
            // function in a function that will call said function with the given context.
            fn = _.bind(fn, context);

            // Return the newly created wrapper function.
            return fn;
        }
    }
}
