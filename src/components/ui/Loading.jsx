import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-16 rounded-lg"
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%"],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.1,
            }}
            style={{
              backgroundSize: "200% 100%",
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
          >
            <motion.div
              className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-4 rounded-lg mb-4"
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: index * 0.1,
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
            <motion.div
              className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-3 rounded-lg mb-2 w-3/4"
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: index * 0.1 + 0.2,
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
            <motion.div
              className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-3 rounded-lg w-1/2"
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: index * 0.1 + 0.4,
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
            >
              <motion.div
                className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-6 rounded-lg mb-3"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              />
              <motion.div
                className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-4 rounded-lg w-2/3"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: index * 0.1 + 0.2,
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <motion.div
              className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-5 rounded-lg mb-4 w-1/3"
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-12 rounded-lg"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <motion.div
              className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-5 rounded-lg mb-4 w-1/3"
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 h-14 rounded-lg"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;