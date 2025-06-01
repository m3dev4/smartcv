'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Import, Plus, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  return (
    <section className="flex items-center justify-center h-full w-full">
      <div className="container relative overflow-hidden">
        <h1 className="text-3xl font-bold">CV</h1>
        {/* import and export resume card */}
        <div className="flex items-center justify-center gap-7 my-11 py-auto">
          <Card className="w-64 h-80 bg-accent border-accent/100 hover:scale-110  transition-transform cursor-pointer group">
            <CardContent className="flex items-center flex-col justify-center h-full p-6 relative">
              <div className="flex items-center justify-center">
                <Plus
                  className="w-24 h-24 group hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex flex-col items-start absolute bottom-0  left-0 px-4">
                <h3 className="text-base font-medium">Créer un nouveau CV</h3>
                <p className="text-sm">Commencez à partir de zéro</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-64 h-80 bg-accent border-accent/100 hover:scale-110  transition-transform cursor-pointer group">
            <CardContent className="flex items-center flex-col justify-center h-full p-6 relative">
              <div className="flex items-center justify-center">
                <Upload
                  className="w-24 h-24 group hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex flex-col items-start absolute bottom-0  left-0 px-4">
                <h3 className="text-base font-medium">Importez un CV éxistant</h3>
                <p className="text-sm">CV, PDF, JSON, etc.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
