import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    let random = Math.random() * totalWeight;
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>任务完成奖励抽选</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入奖励内容"
              value={newReward.content}
              onChange={(e) => setNewReward({ ...newReward, content: e.target.value })}
              className="flex-1"
            />
            <select
              value={newReward.level}
              onChange={(e) => setNewReward({ ...newReward, level: e.target.value })}
              className="p-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>难度 {level}</option>
              ))}
            </select>
            <Button onClick={addReward}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {rewards.map(reward => (
              <div key={reward.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{reward.content} (难度: {reward.level})</span>
                <Button variant="ghost" onClick={() => removeReward(reward.id)}>
                  <Delete className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <Button 
              onClick={selectRandomReward}
              disabled={rewards.length === 0}
              className="w-full"
            >
              抽取奖励
            </Button>

            {selectedReward && (
              <div className="p-4 bg-blue-50 rounded">
                <h3 className="font-bold">恭喜获得奖励：</h3>
                <p>{selectedReward.content}</p>
                <p className="text-sm text-gray-600">难度等级：{selectedReward.level}</p>
              </div>
            )}

            <div className="text-sm text-gray-600">
              已完成任务数：{completedTasks}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardSelector;