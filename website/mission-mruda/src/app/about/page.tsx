"use client";

import { motion } from "framer-motion";
import { FaBullseye, FaTools, FaUsers } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#081c15] to-[#1b4332] py-20 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#74c69d] to-[#52b788] bg-clip-text text-transparent mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Mission Mruda
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-[#F7FFF7] mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Revolutionizing agriculture with AI-driven IoT soil monitoring.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/10"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <motion.div
              className="text-[#4ECDC4] mb-4"
              whileHover={{ scale: 1.1 }}
            >
              <FaBullseye className="w-12 h-12 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#F7FFF7] mb-4">What We Aim For</h2>
            <p className="text-[#F7FFF7]">
              Empowering farmers with real-time soil data to optimize crop yields and reduce waste.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/10"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <motion.div
              className="text-[#4ECDC4] mb-4"
              whileHover={{ scale: 1.1 }}
            >
              <FaTools className="w-12 h-12 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#F7FFF7] mb-4">What We Use</h2>
            <p className="text-[#F7FFF7]">
              Cutting-edge AI and IoT technologies to monitor soil health and provide actionable insights.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/10"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <motion.div
              className="text-[#4ECDC4] mb-4"
              whileHover={{ scale: 1.1 }}
            >
              <FaUsers className="w-12 h-12 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#F7FFF7] mb-4">Who Are Benefitted</h2>
            <p className="text-[#F7FFF7]">
              Farmers, agricultural businesses, and the environment benefit from sustainable farming practices.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;