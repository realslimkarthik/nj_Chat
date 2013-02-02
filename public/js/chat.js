var socket = io.connect("http://localhost");
var roomName = $("#room");
var userName = $("#user");
/*
window.onload = function() {
        var conv = document.getElementById("convo");
        var sendButton = document.getElementById("send");
        var msg = document.getElementById("message");
        var user = document.getElementById("user");

        socket.on("chat", function(data) {
                var tmpl = "<p>{{sender}} : {{message}}</p>";
                var html = Mustache.to_html(tmpl, data);
                convo.innerHTML += html;
        });

        send.onclick = function() {
                if(msg.value) {
                        var sndr = user.innerHTML;
                        var mess = msg.value;
                        var line = {sender: sndr, message: mess};
                        socket.emit("receive", line);
                        //alert(line["sender"] + " " + line["message"]);
                        msg.value = "";
                }
        };
};
*/

$(document).ready(function() {
        socket.on(roomName, function(data) {
                var tmpl = "<p>{{sender}} : {{message}}</p>"
                var html = Mustache.to_html(tmpl, data);
                $("#convo").append(html);
        });
        $("#send").click(function() {
                if($("#message").val()!="") {
                        var sendr = $("#user").html();
                        var mess = $("#message").val();
                        var line = {sender: sendr, message: mess};
                        socket.emit(roomName, line);
                        $("#message").val("");
                }
        });
        $("#exit").click(function() {
                var leave = {roomname: roomName, username: userName};
                $.ajax({
                        url: "exit",
                        data: leave,
                }).done(function(data) {
                        window.close();
                });
        });
});