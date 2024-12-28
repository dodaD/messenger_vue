<template>
  <div class="profile-picture"> Avatar </div>
</template>

<style scoped lang="scss">
@import "@/styles/colours.scss";

.profile-picture {
  border: 1px solid var(--border-colour);
  border-radius: 100px;
  width: 50px;
  height: 50px;
  margin: 10px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
</style>
