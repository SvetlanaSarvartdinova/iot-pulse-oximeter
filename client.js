
document.addEventListener('DOMContentLoaded', function(){

    const startConnection = document.querySelector('[name=start_button]')
    document.getElementById("pulse").innerText = 0;
    document.getElementById("sp02").innerText = 0;
    var pulse = 0;
    var sp = 0;

// websocket connection
    let connect = new WebSocket("ws:192.168.1.72:5679");
    connect.onopen = function() {
      alert('connection established');
      startConnection.onclick = () => {
        connect.send('hello');
    };
    }
    connect.onerror = function(err){
    alert('websocket error: ', err);
    }
    connect.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    document.getElementById("pulse").innerText = msg['pulse_data'];
    document.getElementById("sp02").innerText = msg['sp02_data'];
    pulse = msg['pulse_data'];
    sp = msg['sp02_data'];
    connect.send('sucess');
    }
    connect.onclose = function(e) {
    if(e.wasClean)
        alert('connection is closed');
    }

// graphs
      google.charts.load('current', {
        packages: ['corechart', 'line'],
      });
      google.charts.setOnLoadCallback(drawPulseChart);
      function drawPulseChart() {
        let data = google.visualization.arrayToDataTable([
          ['Time', 'Pulse'],
          [0, 0],
        ]);
        let options = {
          title: 'Pulse Graph',
          hAxis: {
            textPosition: 'none',
          },
          vAxis: {
            title: 'BPM',
          },
        };
        let chart = new google.visualization.LineChart(
          document.getElementById('chart_div1')
        );
        chart.draw(data, options);
        let maxDatas = 50;
        let index = 0;
        setInterval(function () {
          data.addRow([index, pulse]);
          chart.draw(data, options);
          index++;
        }, 1000);
        }

        google.charts.load('current', {
        packages: ['corechart', 'line'],
      });
      google.charts.setOnLoadCallback(drawSpChart);
        function drawSpChart() {
        let data = google.visualization.arrayToDataTable([
          ['Time', 'SpO2'],
          [0, 0],
        ]);
        let options = {
          title: 'SpO2 Graph',
          hAxis: {
            textPosition: 'none',
          },
          vAxis: {
            title: 'SpO2, %',
          },
          series: { 0: { color: 'red',}, },
        };
        let chart = new google.visualization.LineChart(
          document.getElementById('chart_div2')
        );
        chart.draw(data, options);
        let maxDatas = 50;
        let index = 0;
        setInterval(function () {
          data.addRow([index, sp]);
          chart.draw(data, options);
          index++;
        }, 1000);

      }
}, false);
