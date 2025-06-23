import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Globe, 
  Shield, 
  Users, 
  Heart,
  Github,
  Mail,
  Linkedin
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced language models provide intelligent summarization and sentiment analysis.'
    },
    {
      icon: Globe,
      title: 'Multi-Source Aggregation',
      description: 'Fetch news from multiple reliable sources including NewsAPI, Guardian, and NYT.'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get instant results with our efficient MCP server architecture.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built with security best practices and robust error handling.'
    }
  ];

  const team = [
    {
      name: 'BriefSync Team',
      role: 'Development Team',
      description: 'Passionate developers building the future of news aggregation.',
      avatar: '👥'
    }
  ];

  const technologies = [
    'React', 'Node.js', 'Express', 'Socket.IO', 'LangChain', 'Ollama', 
    'Tailwind CSS', 'Framer Motion', 'NewsAPI', 'Natural Language Processing'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            About BriefSync
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We're revolutionizing how people consume and understand news through 
            AI-powered aggregation, intelligent summarization, and real-time analysis.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-16"
        >
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Our Mission</h2>
          <p className="text-lg text-secondary-700 leading-relaxed mb-6">
            In today's information age, staying informed is more challenging than ever. 
            BriefSync was created to solve this problem by providing intelligent, 
            AI-powered news aggregation that helps users quickly understand the 
            most important developments across any topic.
          </p>
          <p className="text-lg text-secondary-700 leading-relaxed">
            Our platform combines cutting-edge AI technology with a user-friendly 
            interface to deliver comprehensive news analysis in seconds, not hours.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-16"
        >
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Technology Stack</h2>
          <p className="text-lg text-secondary-700 mb-6">
            BriefSync is built with modern, scalable technologies that ensure 
            fast performance and reliable operation.
          </p>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-secondary-600 leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card text-center"
        >
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Get in Touch</h2>
          <p className="text-lg text-secondary-700 mb-8">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href="mailto:contact@briefsync.com"
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-secondary-600 flex items-center justify-center">
            Made with <Heart className="w-4 h-4 text-error-500 mx-1" /> by the BriefSync Team
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 