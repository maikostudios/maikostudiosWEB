<template>
  <div class="skeleton-loader" :class="[`skeleton--${variant}`, { 'skeleton--animated': animated }]">
    <!-- Skeleton para tarjetas de proyecto -->
    <template v-if="variant === 'project-card'">
      <div class="skeleton__image"></div>
      <div class="skeleton__content">
        <div class="skeleton__title"></div>
        <div class="skeleton__text"></div>
        <div class="skeleton__text skeleton__text--short"></div>
        <div class="skeleton__chips">
          <div class="skeleton__chip"></div>
          <div class="skeleton__chip"></div>
          <div class="skeleton__chip"></div>
        </div>
        <div class="skeleton__buttons">
          <div class="skeleton__button"></div>
          <div class="skeleton__button"></div>
        </div>
      </div>
    </template>

    <!-- Skeleton para lista de elementos -->
    <template v-else-if="variant === 'list-item'">
      <div class="skeleton__avatar"></div>
      <div class="skeleton__content">
        <div class="skeleton__title"></div>
        <div class="skeleton__text"></div>
      </div>
    </template>

    <!-- Skeleton para formulario -->
    <template v-else-if="variant === 'form'">
      <div class="skeleton__form-group">
        <div class="skeleton__label"></div>
        <div class="skeleton__input"></div>
      </div>
      <div class="skeleton__form-group">
        <div class="skeleton__label"></div>
        <div class="skeleton__input"></div>
      </div>
      <div class="skeleton__form-group">
        <div class="skeleton__label"></div>
        <div class="skeleton__textarea"></div>
      </div>
      <div class="skeleton__button skeleton__button--large"></div>
    </template>

    <!-- Skeleton para tabla -->
    <template v-else-if="variant === 'table'">
      <div class="skeleton__table-header">
        <div class="skeleton__table-cell" v-for="i in columns" :key="`header-${i}`"></div>
      </div>
      <div class="skeleton__table-row" v-for="row in rows" :key="`row-${row}`">
        <div class="skeleton__table-cell" v-for="i in columns" :key="`cell-${row}-${i}`"></div>
      </div>
    </template>

    <!-- Skeleton para texto -->
    <template v-else-if="variant === 'text'">
      <div class="skeleton__text" v-for="line in lines" :key="`line-${line}`"></div>
    </template>

    <!-- Skeleton personalizado -->
    <template v-else-if="variant === 'custom'">
      <slot />
    </template>

    <!-- Skeleton básico (por defecto) -->
    <template v-else>
      <div class="skeleton__basic" :style="{ width, height }"></div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'basic',
    validator: (value) => [
      'basic', 'project-card', 'list-item', 'form', 'table', 'text', 'custom'
    ].includes(value)
  },
  animated: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '20px'
  },
  lines: {
    type: Number,
    default: 3
  },
  rows: {
    type: Number,
    default: 5
  },
  columns: {
    type: Number,
    default: 4
  }
})
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

.skeleton--animated .skeleton__basic,
.skeleton--animated .skeleton__image,
.skeleton--animated .skeleton__title,
.skeleton--animated .skeleton__text,
.skeleton--animated .skeleton__chip,
.skeleton--animated .skeleton__button,
.skeleton--animated .skeleton__avatar,
.skeleton--animated .skeleton__input,
.skeleton--animated .skeleton__textarea,
.skeleton--animated .skeleton__label,
.skeleton--animated .skeleton__table-cell {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0% {
    background-color: rgba(255, 255, 255, 0.1);
  }
  50% {
    background-color: rgba(255, 255, 255, 0.2);
  }
  100% {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

/* Elementos base */
.skeleton__basic,
.skeleton__image,
.skeleton__title,
.skeleton__text,
.skeleton__chip,
.skeleton__button,
.skeleton__avatar,
.skeleton__input,
.skeleton__textarea,
.skeleton__label,
.skeleton__table-cell {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
}

/* Project Card Skeleton */
.skeleton--project-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.skeleton__image {
  width: 100%;
  height: 200px;
  border-radius: 0;
}

.skeleton__content {
  padding: 1.5rem;
}

.skeleton__title {
  height: 24px;
  margin-bottom: 1rem;
  border-radius: var(--radius-sm);
}

.skeleton__text {
  height: 16px;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-sm);
}

.skeleton__text--short {
  width: 70%;
}

.skeleton__chips {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.skeleton__chip {
  width: 60px;
  height: 24px;
  border-radius: 12px;
}

.skeleton__buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.skeleton__button {
  height: 36px;
  flex: 1;
  border-radius: var(--radius-sm);
}

.skeleton__button--large {
  height: 48px;
  margin-top: 1rem;
}

/* List Item Skeleton */
.skeleton--list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.skeleton__avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Form Skeleton */
.skeleton--form {
  padding: 1.5rem;
}

.skeleton__form-group {
  margin-bottom: 1.5rem;
}

.skeleton__label {
  height: 16px;
  width: 120px;
  margin-bottom: 0.5rem;
}

.skeleton__input {
  height: 48px;
  width: 100%;
}

.skeleton__textarea {
  height: 120px;
  width: 100%;
}

/* Table Skeleton */
.skeleton--table {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton__table-header,
.skeleton__table-row {
  display: grid;
  grid-template-columns: repeat(var(--columns, 4), 1fr);
  gap: 1rem;
  padding: 1rem;
}

.skeleton__table-header {
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.skeleton__table-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.skeleton__table-cell {
  height: 20px;
}

/* Text Skeleton */
.skeleton--text .skeleton__text:last-child {
  width: 60%;
}

/* Responsive */
@media (max-width: 768px) {
  .skeleton__content {
    padding: 1rem;
  }
  
  .skeleton__buttons {
    flex-direction: column;
  }
  
  .skeleton__chips {
    flex-wrap: wrap;
  }
}
</style>
