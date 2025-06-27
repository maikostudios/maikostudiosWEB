<template>
  <div class="loading-state" :class="[`loading-state--${variant}`, { 'loading-state--overlay': overlay }]">
    <!-- Spinner básico -->
    <template v-if="variant === 'spinner'">
      <div class="loading-spinner" :class="`loading-spinner--${size}`">
        <v-progress-circular
          :indeterminate="!progress"
          :model-value="progress"
          :size="spinnerSize"
          :width="spinnerWidth"
          :color="color"
        />
      </div>
      <div v-if="message" class="loading-message">{{ message }}</div>
    </template>

    <!-- Dots animados -->
    <template v-else-if="variant === 'dots'">
      <div class="loading-dots">
        <div class="loading-dot" :style="{ backgroundColor: dotColor }"></div>
        <div class="loading-dot" :style="{ backgroundColor: dotColor }"></div>
        <div class="loading-dot" :style="{ backgroundColor: dotColor }"></div>
      </div>
      <div v-if="message" class="loading-message">{{ message }}</div>
    </template>

    <!-- Barra de progreso -->
    <template v-else-if="variant === 'progress'">
      <div class="loading-progress">
        <div v-if="message" class="loading-message">{{ message }}</div>
        <v-progress-linear
          :indeterminate="!progress"
          :model-value="progress"
          :color="color"
          height="6"
          rounded
        />
        <div v-if="progress" class="loading-percentage">{{ Math.round(progress) }}%</div>
      </div>
    </template>

    <!-- Skeleton loader -->
    <template v-else-if="variant === 'skeleton'">
      <SkeletonLoader :variant="skeletonVariant" v-bind="skeletonProps" />
    </template>

    <!-- Estado personalizado -->
    <template v-else-if="variant === 'custom'">
      <slot />
    </template>

    <!-- Pulso (por defecto) -->
    <template v-else>
      <div class="loading-pulse" :class="`loading-pulse--${size}`">
        <div class="pulse-circle" :style="{ backgroundColor: pulseColor }"></div>
        <div class="pulse-circle" :style="{ backgroundColor: pulseColor }"></div>
        <div class="pulse-circle" :style="{ backgroundColor: pulseColor }"></div>
      </div>
      <div v-if="message" class="loading-message">{{ message }}</div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SkeletonLoader from './SkeletonLoader.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'pulse',
    validator: (value) => ['spinner', 'dots', 'progress', 'skeleton', 'pulse', 'custom'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  message: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: null,
    validator: (value) => value === null || (value >= 0 && value <= 100)
  },
  overlay: {
    type: Boolean,
    default: false
  },
  skeletonVariant: {
    type: String,
    default: 'basic'
  },
  skeletonProps: {
    type: Object,
    default: () => ({})
  }
})

// Computed properties para tamaños dinámicos
const spinnerSize = computed(() => {
  const sizes = { small: 24, medium: 40, large: 64 }
  return sizes[props.size]
})

const spinnerWidth = computed(() => {
  const widths = { small: 3, medium: 4, large: 6 }
  return widths[props.size]
})

const dotColor = computed(() => {
  const colors = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)'
  }
  return colors[props.color] || colors.primary
})

const pulseColor = computed(() => dotColor.value)
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.loading-state--overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal);
}

.loading-message {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-align: center;
  max-width: 300px;
}

/* Spinner */
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dots */
.loading-dots {
  display: flex;
  gap: var(--spacing-sm);
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  animation: loading-dots 1.4s ease-in-out infinite both;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes loading-dots {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Progress */
.loading-progress {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.loading-percentage {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Pulse */
.loading-pulse {
  display: flex;
  gap: var(--spacing-xs);
}

.loading-pulse--small .pulse-circle {
  width: 6px;
  height: 6px;
}

.loading-pulse--medium .pulse-circle {
  width: 10px;
  height: 10px;
}

.loading-pulse--large .pulse-circle {
  width: 14px;
  height: 14px;
}

.pulse-circle {
  border-radius: var(--radius-full);
  animation: loading-pulse 1.2s ease-in-out infinite;
}

.pulse-circle:nth-child(1) { animation-delay: 0s; }
.pulse-circle:nth-child(2) { animation-delay: 0.2s; }
.pulse-circle:nth-child(3) { animation-delay: 0.4s; }

@keyframes loading-pulse {
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  30% {
    transform: scale(1.5);
    opacity: 0.7;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .loading-state {
    padding: var(--spacing-md);
  }
  
  .loading-message {
    font-size: var(--font-size-xs);
  }
  
  .loading-progress {
    max-width: 250px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .loading-dot,
  .pulse-circle {
    animation: none;
  }
  
  .loading-dots .loading-dot {
    opacity: 0.7;
  }
  
  .loading-pulse .pulse-circle {
    opacity: 1;
  }
}
</style>
