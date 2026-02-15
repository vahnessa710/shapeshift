import { Button } from '@shapeshift/ui/Button'

interface TabsProps {
  activeTab: 'weight' | 'workout' | 'calendar' | 'trainer'
  setActiveTab: (tab: 'weight' | 'workout' | 'calendar' | 'trainer') => void
}

export const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        onClick={() => setActiveTab('weight')}
        variant={activeTab === 'weight' ? 'default' : 'outline'}
      >
        Weight Log
      </Button>
      <Button
        onClick={() => setActiveTab('workout')}
        variant={activeTab === 'workout' ? 'default' : 'outline'}
      >
        Workout Log
      </Button>
      <Button
        onClick={() => setActiveTab('calendar')}
        variant={activeTab === 'calendar' ? 'default' : 'outline'}
      >
        Calendar
      </Button>
      <Button
        onClick={() => setActiveTab('trainer')}
        variant={activeTab === 'trainer' ? 'default' : 'outline'}
      >
        Trainer
      </Button>
    </div>
  )
}
