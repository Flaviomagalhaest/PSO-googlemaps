var myLatlng = new google.maps.LatLng(-23.973705011113726,-46.31132125854492);
var myOptions = { zoom: 13, center: myLatlng}
var map = '';
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

//DESENHA O MAPA USANDO WEBSERVICE DO GOOGLE MAPS PARA MAPAS ESTÁTICOS
function codificaPath(pathPy, locais) {
    var pathJS = Array();
    Object.keys(pathPy).forEach(function(i) {
        var a = new google.maps.LatLng(pathPy[i].lat, pathPy[i].lng);
        pathJS.push(a);
    }, this);

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    if(locais.caminho.length >= 3) {
        var waypts = []
        for(var i = 1; i < locais.caminho.length - 1; i++) {
            waypts.push({
                location: pathPy[locais.caminho[i]],
                stopover: true
              });        
        }

        var request = {
            origin: pathJS[locais.caminho[0]],
            destination: pathJS[locais.caminho[locais.caminho.length - 1]],
            waypoints: waypts,            
            travelMode: 'DRIVING'
          };
          directionsService.route(request, function(result, status) {
            if (status == 'OK') {
              directionsDisplay.setDirections(result);
            }
          });                
    }
}

var coord = Array();

//Ao carregar pagina, gera gráfico que a cada ponto adicionara uma coordenada na lista
window.onload = function mostraGrafico() {
    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    google.maps.event.addListener(map, 'click', function(event) { 
        placeMarker(event.latLng, map);
        coord.push(event.latLng.toJSON());
    });
}



//Adiciona marcadores no mapa
function placeMarker(location, map) {
    var marker = new google.maps.Marker({
        position: location, 
        map: map
    });
}


//ENVIA CORDENADAS E RECEBE DE VOLA OS RESULTADOS DA ROTA
function envioCoord() {
    var qtdIndiv = $('#qtdIndiv').val();
    var qtdInteracoes = $('#qtdIteracao').val();
    $.ajax({        
        type:'POST',
        url:'/PSO-googlemaps/calcIteracao/',
        contentType: 'application/json; charset=utf-8',
        traditional: true,
        async: false,
        data: JSON.stringify({
            coord : coord,
            qtdIndiv : qtdIndiv,
            qtdInteracoes : qtdInteracoes
        }),
        success: function(response){
            console.log(response);
            codificaPath(response.pontos, response.gbest);
        }
   });

}

function limparTelaClick() {
    coord = Array();
    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    google.maps.event.addListener(map, 'click', function(event) { 
        placeMarker(event.latLng, map);
        coord.push(event.latLng.toJSON());
    });
}

