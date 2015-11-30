# jquery.ageverification
Simple Age Verification Script written in Javascript
example http://juliankoehn.github.io/jquery.ageverification/example/

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
    months: [
				{'id':'00','name':'January'},
				{'id':'01','name':'February'},
				{'id':'02','name':'March'},
				{'id':'03','name':'April'},
				{'id':'04','name':'May'},
				{'id':'05','name':'June'},
				{'id':'06','name':'July'},
				{'id':'07','name':'August'},
				{'id':'08','name':'September'},
				{'id':'09','name':'October'},
				{'id':'10','name':'November'},
				{'id':'11','name':'December'},
			],
	errors: {
				invalidDay: 'Day is invalid or empty',
				invalidYear: 'Year is invalid or empty',
				tooYoung: 'You are not old enough',
			},
    theme: 'default', // Theme Name (must match Folder name), default: default
    themePath: 'ageCheck/themes/', // Path to Theme Folder. Default: 'ageCheck/themes/
    templateVars: {
        title: '', // in default theme Modal Title
        text: '', // in default theme modal text
        btnCancel: 'Cancel',
        btnSubmit: 'Proceed',
    }

To add templateVars just extend the "templateVars" and wrap them into the template like {myvar}.
