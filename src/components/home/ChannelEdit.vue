<template>
  <div class="channel-edit">
    <div class="selected">
      <div class="title">已选频道</div>
      <draggable
        v-model="channelStore.userChannel.selected"
        class="selected-channels"
        :group="{ name: 'channels' }"
        :move="checkMove"
      >
        <template #item="{ element }">
          <div class="item container">
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
      >
        <template #item="{ element }">
          <div class="item container">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { useChannelStore } from '@/stores'
import draggable from 'vuedraggable'

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
</script>

<style lang="less" scoped>
.title {
  margin: 14px;
  font-size: 18px;
}
.selected {
  margin-top: 50px;
  border-top: 1px solid var(--main-color-white-1);
}
.selected-channels,
.unselected-channels {
  display: flex;
  flex-wrap: wrap;
  min-height: 70px;
  border-bottom: 1px solid var(--main-color-white-1);
  background-color: var(--main-color-white-3);
}

.item {
  width: 70px;
  height: 50px;
  margin: 10px;
  background-color: var(--main-color-white-2);
  border: 2px solid var(--main-color-red-3);
  border-radius: 10px;
}
</style>
