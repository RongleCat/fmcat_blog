<template>
  <div>
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
    {{id}}-{{title}}-{{bg_url}}<br />
  </div>
</template>

<script>
export default {
  async asyncData(context) {
    let { data: api_res } = await context.$axios('/api/test')
    return api_res[0]
  }
}
</script>

<style scoped>
</style>