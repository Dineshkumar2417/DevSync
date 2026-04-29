import { motion } from "framer-motion";

const GlassCard = ({ children }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        rotateY: 5, 
        rotateX: -5,
        transition: { duration: 0.3 }
      }}
      style={{ perspective: 1000 }} // Gives it a 3D feel
      className="relative p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl overflow-hidden group"
    >
      {/* The "Liquid" Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
      
      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;