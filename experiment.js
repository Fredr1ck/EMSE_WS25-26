let SEED = "666";
Nof1.SET_SEED(SEED);




const SHORT_NAMES = ["cid","uid","cfg","usrNm","pos","tmp","val","idx",
                            "ref","cnt","err", "msg","buf","str","dat",
                            "arg", "len","num","arr","src"];




const LONG_NAMES = [  "CharacterID","UserID","ConfigurationFile","UserName","Position","TemporaryValue","Value","Index",
                              "ReferenceCount","Counter","ErrorMessage","ResponseMessage","ResultBuffer","StringData","DataObject",
                              "ArgumentList", "LengthInBytes","NumericValue","ArrayElements","SourcePath"];


const UNIVERSAL_LOOPS = [
    "for (let {VAR} of users) { /* ... */ }",
    "if ({VAR} > 0) { /* ... */ }",
    "while ({VAR} < limit) { /* ... */ }",
    "console.log({VAR});",
    "return {VAR};",
    "let total = {VAR} + 1;",
    "if ({VAR} === true) { /* ... */ }",
    "const result = process({VAR});",
    "for (const key in {VAR}) { /* ... */ }",
    "update({VAR});"
];




let experiment_configuration_function = (writer) => { return {

    experiment_name: "TestExperiment",
    seed: SEED,

    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "Please, open the browser in fullscreen mode (probably by pressing [F11]).\n" +
            "In this experiment, you will see different variable names on the screen. Some are short while others are long.\n" +
            "Sometimes you’ll see the name by itself, and sometimes it will appear inside a small code snippet\n"+
            "For each variable name shown: Press [1] if it seems understandable, or [0] if it does not."),
    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the training phase."
        )),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the experiment phase.\n\n"
        )),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Almost done. Next, the experiment data will be downloaded. Please, send the " +
                "downloaded file to the experimenter.\n\nAfter sending your email, you can close this window.\n\nMany thanks for participating."
            )
        )
    ],

    layout: [
        /* ToDo: Hier müssen die Variablen des Experiments rein. Zuerst der Name der Variablen,
                 die unterschiedlichen Werte stehen als List in den Treatments
                 Im ersten Experiment hat man normalerweise nur eine Variable mit 2 Treatments (Werte für die Variable)
         */
        { variable: "NameLength",  treatments: ["short", "long"]},
    ],

    /* ToDo: Hier gebe ich an, wie oft ich jede Treatmentkombination im Experiment testen möchte */
    repetitions: 3,

    /* ToDo: Hier gebe ich an, welche "Art" das Experiment ist. Ich gehe hier davon aus, dass es ein Experiment ist,dass
    *        darauf wartet, dass der Teilnehmer die Taste "0" oder "1" drückt
    *  */
    measurement: Nof1.Reaction_time(Nof1.keys(["0", "1"])),

    task_configuration: (task) => {

        task.do_print_task = () => {

            // Altes Zeug löschen
            writer.clear_stage();


            // Holt den aktuellen Wert aus dem Experiment (short oder long)
            let treatment_of_variable_NameLength = task.treatment_combination.treatment_combination[0].value;

            // random index generieren
            let random_index = Nof1.new_random_integer(SHORT_NAMES.length);

            // Wenn "short" nimm aus der kurzen Liste else aus der langen
            let variableName = (treatment_of_variable_NameLength == "short") ? SHORT_NAMES[random_index] : LONG_NAMES[random_index];


            // wähle zufällig, ob nur Name oder Name + Code gezeigt wird
            let showAsSnippet = Nof1.new_random_integer(2) === 1; // 50/5ß chance


            // wenn Snippet, zufälliges Template auswählen
            let displayText = ""; // Variable für den späteren Text
            if (showAsSnippet) {

                // Wählt zufällig eine Vorlage aus der UNIVERSAL_LOOPS-Liste
                let random_loop = UNIVERSAL_LOOPS[Nof1.new_random_integer(UNIVERSAL_LOOPS.length)];

                // Ersetzt in der Vorlage den Platzhalter {VAR} durch Variablennamen
                let loop_with_var = random_loop.replaceAll("{VAR}", variableName);

                // Baut den Text für die Anzeige zusammen
                displayText = "Code snippet:<br><pre>" + loop_with_var + "</pre>";
            } else {

                // Wenn kein Code aus der Vorlage dann nur den Variablennamen
                displayText = "Variable name: <b>" + variableName + "</b>";
            }


            writer.print_html_on_stage(
                displayText + "<br><br>Press [1] if understandable, [0] if not understandable."
            );

            // keine bestimmte "richtige" Taste erwartet (weil subjektive Einschätzung)
            task.expected_answer = null;
        };

        /* ToDo: Legt fest, wann eine Aufgabe als bearbeitet angesehen wird. Die Variable "answer" ist dabei die Taste, die gedrückt wurde.
                 Falls es für das Experiment egal ist, einfach true zurückgeben.
        *  */
        task.accepts_answer_function = (answer) => {

            return true

        }

        /**
         * ToDo: Legt fest, was angezeigt wird, wenn die falsche Taste gedrückt wurde.
         */
        task.do_print_error_message = () => {
            writer.print_error_string_on_stage(
                writer.convert_string_to_html_string("Ok, there was something wrong. Dont mind. Just press the other button."));
        }

        /**
         * ToDo: Legt fest, was angezeigt wird, wenn die richtige Taste gedrückt wurde.
         */
        task.do_print_after_task_information = () => {
            writer.clear_stage();
            writer.print_html_on_stage(
                writer.convert_string_to_html_string("When you press [Enter] the experiment goes on."));
        }
    }
}};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
