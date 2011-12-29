$(function() {
    var $input = $('input'),
    $textArea = $('textarea'),
    buffer = [],
    bufferPos = 0;

    function append(line) {
        $textArea.val($textArea.val() + '\n' + line);
        $textArea.scrollTop($textArea.prop('scrollHeight'));
    }

    $input.keydown(function(e) {
        var line, currentPos = bufferPos;
        switch (e.keyCode) {
        case 13:
            line = $input.val();
            $input.val('');
            buffer.push(line);
            bufferPos = buffer.length;
            $.get('/?q=' + encodeURIComponent(line), function(res) {
                append(line + ':\n' + res);
            });
            return false;
        case 38:
            bufferPos--;
            break;
        case 40:
            bufferPos++;
            break;
        }
        if (bufferPos < 0) {
            bufferPos = 0;
        } else if (bufferPos > buffer.length) {
            bufferPos = buffer.length;
        }

        if (currentPos !== bufferPos) {
            $input.val(buffer[bufferPos]);
            return false;
        }
    });

    $textArea.height(window.innerHeight - 120);
});

