"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Zap, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for getting started',
    price: { monthly: 9, annually: 90 },
    features: ['Up to 5 password vaults', 'Basic security reports', 'Multi-device sync', '24/7 email support'],
    color: 'bg-blue-500',
  },
  {
    name: 'Pro',
    description: 'Best for power users',
    price: { monthly: 19, annually: 190 },
    features: ['Unlimited password vaults', 'Advanced security dashboard', 'Priority 24/7 support', 'Secure document storage', 'Dark web monitoring'],
    color: 'bg-purple-600',
  },
]

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BillingModal({ isOpen, onClose }: BillingModalProps) {
  const [isAnnual, setIsAnnual] = useState(false)
  const [animatedPrices, setAnimatedPrices] = useState(plans.map(plan => plan.price.monthly))

  useEffect(() => {
    const targetPrices = plans.map(plan => isAnnual ? plan.price.annually : plan.price.monthly)
    const animation = setInterval(() => {
      setAnimatedPrices(prev => prev.map((price, index) => {
        const diff = targetPrices[index] - price
        if (Math.abs(diff) < 1) return targetPrices[index]
        return price + diff / 10
      }))
    }, 20)
    return () => clearInterval(animation)
  }, [isAnnual])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-bold">Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your needs and take your password security to the next level.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <span className={`text-lg transition-colors ${!isAnnual ? 'text-primary font-bold' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-lg transition-colors ${isAnnual ? 'text-primary font-bold' : 'text-muted-foreground'}`}>Annually</span>
            <Badge variant="secondary" className="text-primary">Save 20%</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`overflow-hidden transition-shadow hover:shadow-lg ${plan.name === 'Pro' ? 'border-primary' : ''}`}>
                    <CardHeader className={`${plan.color} text-white`}>
                      <CardTitle className="text-2xl font-bold flex items-center">
                        {plan.name}
                        {plan.name === 'Pro' && <Sparkles className="ml-2 h-5 w-5" />}
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-4xl font-bold mb-4 text-primary">
                        ${Math.round(animatedPrices[index])}
                        <span className="text-lg font-normal text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="text-green-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant={plan.name === 'Pro' ? 'default' : 'outline'}>
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

