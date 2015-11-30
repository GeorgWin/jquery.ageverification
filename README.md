# jquery.ageverification
Simple Age Verification Script written in Javascript

### Requirements

* jQuery

### Installation

Add this line somewhere after jQuery

    <script type="text/javascript" src="ageCheck/js/ageCheck.js"></script>

### Usage

    <script>
        $(document).ready(function() {
            $.ageCheck({
                minAge: 18,
                templateVars: {
                    title: 'Age Verification',
                    text: 'This is a text',
                }
            });
        }
    </script>

### Options


    minAge: '', // default 18
    cookie: {
        enabled: false, // default false
        days: '1', // default 1 
    },
    redirectTo: '', // URI to redirect after Verification, default: none
    redirectToDeclined: '', // URI to redirect if failed, default: http://www.google.com
    theme: 'default', // Theme Name (must match Folder name), default: default
    themePath: 'ageCheck/themes/', // Path to Theme Folder. Default: 'ageCheck/themes/
    templateVars: {
        title: '', // in default theme Modal Title
        text: '', // in default theme modal text
    }

To add templateVars just extend the "templateVars" and wrap them into the template like {myvar}.
