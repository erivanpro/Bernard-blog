'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface ArticleStats {
  date: string;
  count: number;
}

interface ArticlesDashboardProps {
  userId: number;
}

export default function ArticlesDashboard({ userId }: ArticlesDashboardProps) {
  const [stats, setStats] = useState<ArticleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2000s

        const res = await fetch(`https://bernard-backend-a1go.onrender.com/articles/stats?userId=${userId}`);
        if (!res.ok) throw new Error('Erreur lors de la récupération des statistiques');
        const data: ArticleStats[] = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const labels = stats.map((s) => s.date);
  const counts = stats.map((s) => s.count);

  const sharedOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#000' },
        position: 'top' as const,
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#000' },
        grid: { color: '#f3f4f6' },
      },
      y: {
        ticks: { color: '#000' },
        grid: { color: '#f3f4f6' },
      },
    },
  };

  const barData = {
    labels,
    datasets: [
      {
        label: 'Articles (barres)',
        data: counts,
        backgroundColor: '#000000',
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Articles (ligne)',
        data: counts,
        borderColor: '#000',
        backgroundColor: '#00000011',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        label: 'Répartition',
        data: counts,
        backgroundColor: labels.map(() => '#000'),
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6 bg-white text-black">
        <h2 className="text-xl font-bold mb-8 text-left">Dashboard des Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
                <div className="h-40 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-600">Erreur : {error}</p>;

  return (
    <div className="p-6 bg-white text-black">
      <h2 className="text-xl font-bold mb-8 text-left">Dashboard des Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Graphique en barres :</strong> montre combien d’articles ont été publiés chaque jour.
          </p>
          <Bar data={barData} options={sharedOptions} />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Graphique en ligne :</strong> affiche l’évolution quotidienne du nombre d’articles.
          </p>
          <Line data={lineData} options={sharedOptions} />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Graphique circulaire :</strong> représente la répartition des publications par jour.
          </p>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: '#000' },
                  position: 'bottom',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
