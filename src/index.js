import Chart from "chart.js";
import datalabels from "chartjs-plugin-datalabels";

export var data = {};
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.

export var state = {
  
  // Haupt-Farben

  Haupt_Farbe: '#D32D20', // Bild-Rot
  Green: '#6CBA6C',
  darkGreen: '#45891B',
  Blue: '#42A8CC',
  darkBlue: '#036E93',


  // Partei-Farben

  cdu_csu_farbe: '#143d4b',
  cdu_farbe: '#162129',
  csu_farbe: '#1782d1',
  spd_farbe: '#e0341f',
  afd_farbe: '#00b8e3',
  fdp_farbe: '#f4d50b',
  gruene_farbe: '#3bae53',
  dielinke_farbe: '#a00163',
  sonstige_parteien_farbe: '#c5cad0',
  nichtwahler_farbe: '#dce1e0',
  

  // weitere Optionen

  Label_Beschriftung: 'Schlusskurs in Euro',
  Punkt_Radius: 5,
  farbe_highlight_punkte: '#D32D20',
  position_highlight_kasten: 'bottom'

  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
};

export function update() {
  
  function comma_to_point(num){
    if (num.indexOf(',') > -1){
      var raw = num;
      var comma = raw.split(',');
      var pointer = comma.join('.');
      return pointer
      //console.log(pointer)
    }
    return num
  }


  function date_converter_us_eu(datum){
    var date_raw = datum;
    var us_date = date_raw.split('/');
    var euro_date = us_date[1] + "." + us_date[0] + "." + us_date[2];
    return euro_date


  }


  var ctx = document.getElementById('chart').getContext('2d');


  var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: data.kurs.map(function(d) { return date_converter_us_eu(d.datum_schlusskurs)}),
          datasets: [{
              highlights: data.kurs.map(function(d) { return d.highlights; }),
              label: state.Label_Beschriftung,
              backgroundColor: 'transparent',
              borderColor: state.Haupt_Farbe,
              data: data.kurs.map(function(d) { return comma_to_point(d.schlusskurs) }),
              radius: state.Punkt_Radius,
          }]
      },  
      options: {
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            fontStyle: 'bold',
            fontColor: state.Haupt_Farbe,
          },
        },
        plugins: {
          datalabels: {
            backgroundColor: 'white',
            borderColor: 'rgb(255, 99, 132)',
            borderRadius: 8,
            borderWidth: 1,
            opacity: '0.7',
            offset: '10',
            align: state.position_highlight_kasten,
            anchor: 'start',
            color: 'black',
            textAlign: 'center',
            rotation: '0',
            font: {
              weight: 'bold',
              size: '13',
              lineHeight: '1.2'
            },
            display: function(context) {
              return context.dataset.highlights; // display labels with an odd index
              //return context.data;
              },
            formatter: function(value, context) {
              if (context.dataset.highlights[context.dataIndex] != ""){
                var legend_text = context.dataset.highlights[context.dataIndex];
                var textarray = legend_text.split(' ');
                if (textarray.length >= 7){
                  for (i = 5; i < textarray.length; i = i + 5){
                    textarray.splice(i, 0, '\n');
                    //console.log(textarray)
                  }
                  legend_text = textarray.join(' ');

                }
                var legend_datum = context.chart.dataset
                
                return context.chart.data.labels[context.dataIndex] + ': ' + '\n' + legend_text;
              }}
          
        }
      
      }
  }});

  Chart.plugins.register({
  afterDraw: function (chart) {
    var ctx = chart.ctx;
    chart.data.datasets.forEach(function (dataset, i) {
      var meta = chart.getDatasetMeta(i)
      dataset.highlights.forEach(function (highlight, i){
        if (!meta.hidden) {
          if (highlight != "") {
              var label_position = meta.data[i].tooltipPosition();
              ctx.beginPath();
              ctx.arc(label_position.x,label_position.y, 6, 0, 2*Math.PI, false);
              ctx.fillStyle = state.farbe_highlight_punkte;
              ctx.strokeStyle = state.farbe_highlight_punkte;
              ctx.lineWidth = '7';
              ctx.stroke();
              ctx.fill();
          }
        
        }
        
      })
    })
  }
}) 
 
  // The update function is called whenever the user changes a data table or settings
  // in the visualisation editor, or when changing slides in the story editor.

  // Tip: to make your template work nicely in the story editor, ensure that all user
  // interface controls such as buttons and sliders update the state and then call update.
}

export function draw() {
  // The draw function is called when the template first loads
  update();
}
