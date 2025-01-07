'use client'

import React, { useState } from 'react';
import { Plus, Delete } from 'lucide-react';

interface Reward {
  id: number;
  content: string;
  level: string;
}

const RewardSelector: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [newReward, setNewReward] = useState<Omit<Reward, 'id'>>({ content: '', level: '1' });
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [completedTasks, setCompletedTasks] = useState<number>(0);

  const addReward = () => {
    if (newReward.content.trim()) {
      setRewards([...rewards, { ...newReward, id: Date.now() }]);
      setNewReward({ content: '', level: '1' });
    }
  };

  const removeReward = (id: number) => {
    setRewards(rewards.filter(reward => reward.id !== id));
  };

  const selectRandomReward = () => {
    if (rewards.length === 0) return;

    const taskFactor = Math.min(completedTasks / 10, 1);

    const weights = rewards.map(reward => {
      const level = parseInt(reward.level);
      if (level <= 2) {
        return 1 - taskFactor * 0.5;
      } else if (level >= 4) {
        return 0.5 + taskFactor * 0.5;
      }
      return 1;
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;
    
    for (let i = 0; i < rewards.length; i++) {
      currentWeight += weights[i];
      if (random <= currentWeight) {
        setSelectedReward(rewards[i]);
        setCompletedTasks(prev => prev + 1);
        break;
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">任务完成奖励抽选</h2>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="输入奖励内容"
              value={newReward.content}
              onChange={(e) => setNewReward({ ...newReward, content: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newReward.level}
              onChange={(e) => setNewReward({ ...newReward, level: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>难度 {level}</option>
              ))}
            </select>
            <button
              onClick={addReward}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2">
            {rewards.map(reward => (
              <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>{reward.content} (难度: {reward.level})</span>
                <button
                  onClick={() => removeReward(reward.id)}
                  className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4">
            <button
              onClick={selectRandomReward}
              disabled={rewards.length === 0}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              抽取奖励
            </button>

            {selectedReward && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">恭喜获得奖励：</h3>
                <p className="text-lg">{selectedReward.content}</p>
                <p className="text-sm text-gray-600 mt-2">难度等级：{selectedReward.level}</p>
              </div>
            )}

            <div className="text-sm text-gray-600 text-center">
              已完成任务数：{completedTasks}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSelector;