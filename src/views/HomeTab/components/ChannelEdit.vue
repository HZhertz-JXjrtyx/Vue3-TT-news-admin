<script setup>
import draggable from 'vuedraggable'
import { useChannelStore } from '@/stores'

const emit = defineEmits(['switch-channel'])
const channelStore = useChannelStore()
const checkMove = (evt) => {
  if (evt.draggedContext.element.id === 0) {
    return false
  } else if (evt.relatedContext.element) {
    if (channelStore.userChannel.selected.length !== 1 && evt.relatedContext.element.id === 0) {
      return false
    }
  }
}
const switchChannel = (element) => {
  emit('switch-channel', element.id)
}
</script>

<template>
  <div class="channel-edit">
    <div class="selected">
      <div class="title">已选频道</div>
      <draggable
        v-model="channelStore.userChannel.selected"
        class="selected-channels"
        :group="{ name: 'channels' }"
        :move="checkMove"
        itemKey="id"
      >
        <template #item="{ element }">
          <div class="item" @click="switchChannel(element)">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>

    <div class="unselected">
      <div class="title">未选频道</div>
      <draggable
        v-model="channelStore.userChannel.unselected"
        class="unselected-channels"
        :group="{ name: 'channels' }"
        :move="checkMove"
        itemKey="id"
      >
        <template #item="{ element }">
          <div class="item">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style lang="less" scoped>
.title {
  margin: 28px;
  font-size: 34px;
}
.selected {
  margin-top: 100px;
  border-top: 2px solid var(--bg-color-3);
}
.selected-channels,
.unselected-channels {
  display: flex;
  flex-wrap: wrap;
  min-height: 140px;
  border-bottom: 2px solid var(--bg-color-3);
  background-color: var(--bg-color-1);
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 80px;
  margin: 20px;
  border: 4px solid var(--main-color-red-1);
  border-radius: 10px;
}
</style>
