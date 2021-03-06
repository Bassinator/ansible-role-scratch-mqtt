/* Extension to enable mqtt communication */
/* Bastian Bukatz <bastian.greuel@gmail.com>, Aug 2020 */

(function(ext) {

  $.getScript("http://{{ library_host }}:{{ library_port }}/mqttws31.js", function( data, textStatus, jqxhr ) {
  console.log( data ); // Data returned
  console.log( textStatus ); // Success
  console.log( jqxhr.status ); // 200
  console.log( "Load was performed." );
  });

  $.getScript("http://{{ library_host }}:{{ library_port }}/jquery.min.js", function(){});

  var mqtt;
  var reconnectTimeout = 2000;
  var messagePayload = '';
  var newMessage = false;

  host = 'test.mosquitto.org';
  port = 8081;
  topic = '/scratchExtensionTopic';		// topic to subscribe to
  useTLS = true;
  username = null;
  password = null;
  cleansession = true;
  state = {status: 1, msg: 'loaded'};


  function MQTTconnect() {

    if (typeof path == "undefined") {
      path = '/mqtt';
      console.log("path=" + path);
    };


    mqtt = new Paho.MQTT.Client(
      host,
      port,
      "web_" + parseInt(Math.random() * 100, 10)
    );

    var options = {
      timeout: 3,
      useSSL: useTLS,
      cleanSession: cleansession,
      onSuccess: onConnect,
      onFailure: function (message) {
          $('#status').val("Connection failed: " + message.errorMessage + "Retrying");
          setTimeout(MQTTconnect, reconnectTimeout);
    }
  };

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;

    if (username != null) {
        options.userName = username;
        options.password = password;
    }
    console.log("Host="+ host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " username=" + username + " password=" + password);
    mqtt.connect(options);
  }



    function onMessageArrived(message) {
        console.log("message arrived " + message.payloadString);
        messagePayload = message.payloadString;
        newMessage = true;
    };

    function onConnect() {
        console.log("trying to connect");
        state = {status: 1, msg: 'connecting ...'};
        $('#status').val('Connected to ' + host + ':' + port + path);
        // Connection succeeded; subscribe to our topic
        mqtt.subscribe(topic, {qos: 0});
        $('#topic').val(topic);
        state = {status: 2, msg: 'conected'};
    };


    function onConnectionLost(response) {
        state = {status: 1, msg: 'connecting ...'};
        setTimeout(MQTTconnect, reconnectTimeout);
        $('#status').val("connection lost: " + response.errorMessage + ". Reconnecting");
    };


    ext._shutdown = function() {};

    ext._getStatus = function() {
        return state;
    };

    ext.set_host = function(_host) {
      host = _host;
    };

    ext.set_topic = function(_topic) {
      topic = _topic;
    };

    ext.set_port = function(_port) {
      port = _port;
    };


    ext.connect = function() {
      MQTTconnect();
    };

    ext.set_TLS = function(_useTLS) {
      if ( _useTLS == "true") {
        useTLS = true;
      };
      if ( _useTLS == "false") {
        useTLS = false;
      };
    };

    ext.get_message = function() {
      return messagePayload;
    }

    ext.send_message = function(message, _topic) {
      mqtt.send(_topic, message);
      console.log("message published");
    };

    ext.message_arrived = function() {
       if ( newMessage ) {
           newMessage = false;
           return true;
       }
       return false;
    };


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'send message %s to topic %s', 'send_message', 'message', '/scratchExtensionTopic'],
            ['r', 'message', 'get_message'],
            ['b', 'message arrived', 'message_arrived'],
            [' ', 'secure connection  %m.secureConnection', 'set_TLS', 'true'],
            [' ', 'Host %s', 'set_host', 'test.mosquitto.org'],
            [' ', 'Subscribe to topic %s', 'set_topic', '/scratchExtensionTopic'],
            [' ', 'Port %n', 'set_port', 8081],
            [' ', 'connect', 'connect'],
        ],
        menus: {
            secureConnection: ['true', 'false'],
        },
    };

    // Register the extension
    ScratchExtensions.register('MQTT Extension', descriptor, ext);
})({});
