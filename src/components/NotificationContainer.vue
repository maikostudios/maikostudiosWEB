<template>
  <teleport to="body">
    <div class="notification-container" :class="`position-${position}`">
      <transition-group name="notification" tag="div" class="notifications-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="[
            `notification--${notification.type}`,
            { 'notification--closable': notification.closable }
          ]"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification__content">
            <div class="notification__icon">
              <v-icon :color="getIconColor(notification.type)">
                {{ getIcon(notification.type) }}
              </v-icon>
            </div>
            
            <div class="notification__message">
              <div v-if="notification.title" class="notification__title">
                {{ notification.title }}
              </div>
              <div class="notification__text">
                {{ notification.message }}
              </div>
            </div>
            
            <div v-if="notification.closable" class="notification__close">
              <v-btn
                icon
                size="small"
                variant="text"
                @click.stop="removeNotification(notification.id)"
              >
                <v-icon size="small">mdi-close</v-icon>
              </v-btn>
            </div>
          </div>
          
          <div
            v-if="notification.showProgress && !notification.persistent"
            class="notification__progress"
            :style="{ animationDuration: `${notification.duration}ms` }"
          ></div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { globalNotifications } from '@/composables/useNotifications'

const props = defineProps({
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(value)
  }
})

const { notifications, removeNotification } = globalNotifications

const getIcon = (type) => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  }
  return icons[type] || icons.info
}

const getIconColor = (type) => {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return colors[type] || colors.info
}

const handleNotificationClick = (notification) => {
  if (notification.onClick) {
    notification.onClick(notification)
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  z-index: var(--z-toast);
  pointer-events: none;
  max-width: 400px;
  width: 100%;
}

.position-top-left {
  top: var(--spacing-lg);
  left: var(--spacing-lg);
}

.position-top-center {
  top: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
}

.position-top-right {
  top: var(--spacing-lg);
  right: var(--spacing-lg);
}

.position-bottom-left {
  bottom: var(--spacing-lg);
  left: var(--spacing-lg);
}

.position-bottom-center {
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
}

.position-bottom-right {
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.notification {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
}

.notification:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.notification--success {
  border-left: 4px solid var(--color-success);
}

.notification--error {
  border-left: 4px solid var(--color-error);
}

.notification--warning {
  border-left: 4px solid var(--color-warning);
}

.notification--info {
  border-left: 4px solid var(--color-info);
}

.notification__content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}

.notification__icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.notification__message {
  flex: 1;
  min-width: 0;
}

.notification__title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
}

.notification__text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  word-wrap: break-word;
}

.notification__close {
  flex-shrink: 0;
  margin-left: var(--spacing-sm);
}

.notification__progress {
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  animation: progress-bar linear forwards;
  transform-origin: left;
}

@keyframes progress-bar {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Transiciones */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 480px) {
  .notification-container {
    left: var(--spacing-sm) !important;
    right: var(--spacing-sm) !important;
    max-width: none;
    transform: none !important;
  }
  
  .notification__content {
    padding: var(--spacing-sm);
  }
}
</style>
