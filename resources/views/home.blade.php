<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        #graph {
            width: 1200px;
            height: 700px;
        }

    </style>
</head>

<body>
    <div id="name">
        <form id="name-form">
            <h3>Как тебя зовут?</h3>
            <input type="text" id="name-input" />
            <input type="submit" />
        </form>
    </div>
    <div id="game" style="display: none">
        <h1 id="title">Choice</h1>
        <button id="choice-1">Choice 1</button>
        <button id="choice-2">Choice 2</button>
    </div>
    <div id="graph" style="display: none;">
    </div>

    <script src="{{ mix('js/app.js') }}"></script>
</body>

</html>
