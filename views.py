from django.http import JsonResponse
from django.shortcuts import render
from django.template import loader
from py import ConfigConstants as cc
from py import main
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

def index(request):
    template = loader.get_template('PSO-googlemaps/index.html')
    key = cc.inicializaConfig()
    context = {
        'key': key.key
    }
    return render(request,'PSO-googlemaps/index.html',context)

@csrf_exempt
@require_http_methods(['POST']) 
def calcIteracao(request):
    jsonAjax = json.loads((request.body).decode('utf-8'))

    coordenadas = jsonAjax['coord']
    qtdIndiv = jsonAjax['qtdIndiv']
    qtdInteracoes = jsonAjax['qtdInteracoes']

    resultado = main.pso(coordenadas, qtdIndiv, qtdInteracoes)
    key = cc.inicializaConfig()
    context = {
        'key': key.key,
    }
    return JsonResponse(json.loads(resultado))