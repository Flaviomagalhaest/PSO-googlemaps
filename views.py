from django.http import JsonResponse
from django.shortcuts import render
from django.template import loader
from py import ConfigConstants as cc
from py import main
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

def index(request):
    template = loader.get_template('googlemapspso/index.html')
    key = cc.inicializaConfig()
    context = {
        'key': key.key
    }
    return render(request,'googlemapspso/index.html',context)

@csrf_exempt
@require_http_methods(['POST']) 
def teste(request):
    jsonAjax = (request.body).decode('utf-8')
    coordenadas = json.loads(jsonAjax)
    resultado = main.pso(coordenadas)
    key = cc.inicializaConfig()
    context = {
        'key': key.key,
    }
    return JsonResponse(json.loads(resultado))