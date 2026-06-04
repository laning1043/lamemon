/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Tasks } from './components/Tasks';
import { Accounting } from './components/Accounting';
import { Notes } from './components/Notes';
import { AddEventModal } from './components/AddEventModal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'accounting':
        return <Accounting />;
      case 'notes':
        return <Notes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      {/* Global Add Button (only on dashboard) */}
      {activeTab === 'dashboard' && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-cyan-500 text-white rounded-2xl shadow-2xl shadow-cyan-200 flex items-center justify-center hover:scale-110 transition-transform z-40"
        >
          <div className="w-8 h-8 flex items-center justify-center">
             <span className="text-3xl font-light">+</span>
          </div>
        </button>
      )}

      <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
