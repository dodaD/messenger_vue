<script>
(async () => {
  const id = currentUserStore.userId === $user_id ? $receiver_id : $user_id;
  currentOtherUserStore.otherUserId = id;
  $receiver_type = $receiver_type.replace('App\\Models\\', '');
  currentOtherUserStore.entity = $receiver_type;

  const response = await fetch(`http://localhost/api/user-info/${id}/${$receiver_type}`, {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    }
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    //TODO push to login page
    return;
  }
  currentOtherUserStore.userName = responseJSON.name;
  currentOtherUserStore.userNickname = responseJSON.nickname;
})();
</script>
