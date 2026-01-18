import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Lock, Sliders, ArrowRight, ArrowLeft } from 'lucide-react';
import CreateTokenForm from '../components/tools/CreateTokenForm';
import CreateTokenLockForm from '../components/tools/CreateTokenLockForm';
import CreateTokenPresaleForm from '../components/tools/CreateTokenPresaleForm';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const Tools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'createToken',
      title: 'Create a new Token',
      description: 'Deploy a standard, mintable, or taxable ERC20 token.',
      icon: DollarSign,
      bgColor: 'bg-ink',
      textColor: 'text-canvas',
      iconBg: 'bg-white/20',
    },
    {
      id: 'createLock',
      title: 'Create a Lock',
      description: 'Lock your token liquidity to build trust with your community.',
      icon: Lock,
      bgColor: 'bg-white',
      textColor: 'text-ink',
      iconBg: 'bg-ink/5',
    },
    {
      id: 'createPresale',
      title: 'Create a Presale',
      description: 'Launch a presale for your token to raise funds.',
      icon: Sliders,
      bgColor: 'bg-white',
      textColor: 'text-ink',
      iconBg: 'bg-ink/5',
    },
  ];

  const renderForm = () => {
    switch (selectedTool) {
      case 'createToken':
        return <CreateTokenForm />;
      case 'createLock':
        return <CreateTokenLockForm />;
      case 'createPresale':
        return <CreateTokenPresaleForm />;
      default:
        return null;
    }
  };

  if (selectedTool) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSelectedTool(null)}
          className="flex items-center gap-2 text-body text-ink-muted hover:text-ink transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to tools</span>
        </motion.button>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-border p-6 md:p-8"
        >
          {renderForm()}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Header */}
      <motion.section variants={itemVariants} className="space-y-2">
        <h1 className="font-display text-display-lg text-ink">
          Create
        </h1>
      </motion.section>

      {/* Assets Section */}
      <motion.section variants={itemVariants} className="space-y-6">
        <h2 className="font-display text-display-md text-ink">
          Assets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <motion.button
                key={tool.id}
                variants={cardVariants}
                onClick={() => setSelectedTool(tool.id)}
                className={`${tool.bgColor} ${tool.textColor} rounded-3xl border border-border p-6 md:p-8 text-left relative overflow-hidden group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className={`${tool.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="font-display text-display-sm font-semibold mb-2">
                  {tool.title}
                </h3>
                <p className="text-body-sm opacity-80 mb-6">
                  {tool.description}
                </p>

                {/* Arrow */}
                <div className="absolute bottom-6 right-6">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Tools;

