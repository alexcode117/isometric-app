'use client'
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const baseFormatWidth = 270;
const baseFormatHeight = 193; // 205 - 12

const scales = [
  { label: 'Escala 2:1', value: 2 },
  { label: 'Escala 1:1', value: 1 },
  { label: 'Escala 1:2', value: 0.5 },
  { label: 'Escala 1:5', value: 0.2 },
  { label: 'Escala 1:10', value: 0.1 },
];

const angle = 30 * (Math.PI / 180);

function calculateIsometricDimensions(width: number, depth: number, height: number) {
  const isoWidth = Math.abs(width * Math.cos(angle)) + Math.abs(depth * Math.cos(angle));
  const isoHeight = height + Math.abs(width * Math.sin(angle)) + Math.abs(depth * Math.sin(angle));
  console.log(isoWidth, isoHeight);
  return { isoWidth, isoHeight };
}

function validateInput(value: string): number {
  const num = Number(value);
  if (isNaN(num) || num < 0) return 0;
  return num;
}

export default function Home() {
  const [width, setWidth] = useState<string>('');
  const [depth, setDepth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [calculatedDimensions, setCalculatedDimensions] = useState<{
    isoWidth: number;
    isoHeight: number;
    marginLeft: number;
    marginTop: number;
    formatWidth: number;
    formatHeight: number;
  } | null>(null);

  const handleCalculate = () => {
    const numWidth = validateInput(width);
    const numDepth = validateInput(depth);
    const numHeight = validateInput(height);

    const { isoWidth, isoHeight } = calculateIsometricDimensions(numWidth, numDepth, numHeight);

    // Calcular dimensiones del formato según la escala
    const formatWidth = baseFormatWidth / scale;
    const formatHeight = baseFormatHeight / scale;

    // Verificar si las dimensiones son mayores que el formato
    if (isoWidth > formatWidth || isoHeight > formatHeight) {
      alert('Las dimensiones exceden el tamaño del formato. Por favor, ajusta la escala o reduce las dimensiones.');
      return;
    }

    const marginLeft = (formatWidth - isoWidth) / 2;
    const marginTop = (formatHeight - isoHeight) / 2;

    setCalculatedDimensions({
      isoWidth,
      isoHeight,
      marginLeft,
      marginTop,
      formatWidth,
      formatHeight
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-4 sm:p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-slate-800 shadow-xl rounded-xl mb-4">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-50 text-center">Calculadora de Márgenes en Isometría</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-slate-200">Ancho (mm)</Label>
              <Input 
                type="number" 
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                onBlur={(e) => setWidth(validateInput(e.target.value).toString())}
                min="0"
                step="1"
                className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Ancho"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Profundidad (mm)</Label>
              <Input 
                type="number" 
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                onBlur={(e) => setDepth(validateInput(e.target.value).toString())}
                min="0"
                step="1"
                className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Profundidad"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Altura (mm)</Label>
              <Input 
                type="number" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                onBlur={(e) => setHeight(validateInput(e.target.value).toString())}
                min="0"
                step="1"
                className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Altura"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-200">Escala</Label>
            <Select onValueChange={(v) => setScale(Number(v))} defaultValue="1">
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-slate-50 border-slate-600">
                {scales.map(({ label, value }) => (
                  <SelectItem 
                    key={value} 
                    value={value.toString()}
                    className="hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
          >
            Calcular Dimensiones
          </Button>

          <Separator className="my-4 bg-slate-600" />

          {calculatedDimensions && (
            <div className="text-sm space-y-2 bg-slate-700/50 p-4 rounded-lg">
              <p className="font-semibold text-slate-50">Dimensiones del formato:</p>
              <div className="space-y-1 text-slate-200">
                <p>Ancho: {calculatedDimensions.formatWidth.toFixed(2)} mm</p>
                <p>Alto: {calculatedDimensions.formatHeight.toFixed(2)} mm</p>
              </div>
              <p className="font-semibold text-slate-50 pt-2">Dimensiones en isometría:</p>
              <div className="space-y-1 text-slate-200">
                <p>Ancho proyectado: {calculatedDimensions.isoWidth.toFixed(2)} mm</p>
                <p>Altura proyectada: {calculatedDimensions.isoHeight.toFixed(2)} mm</p>
              </div>
              <p className="font-semibold text-slate-50 pt-2">Márgenes sugeridos:</p>
              <div className="space-y-1 text-slate-200">
                <p>Margen superior e inferior: {calculatedDimensions.marginTop.toFixed(2)} mm</p>
                <p>Margen izquierdo y derecho: {calculatedDimensions.marginLeft.toFixed(2)} mm</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="text-slate-400 text-sm text-center">
        <p>Desarrollado por el Ing. Alejandro Aguilar</p>
        <p className="text-xs mt-1">© {new Date().getFullYear()} Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
