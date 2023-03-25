<script setup lang="ts">
import { parse } from "~/plugins/qzqsm_parser";

const items = [
  "$QZQSM,57,9aac8898960003240000312c05377c5ac00001000000000100000012ff02f88*71", // 緊急地震速報
  "$QZQSM,61,C6AF8C9820000324000030400548C5E2C000000003DFF8001C0000125E59614*71", // 緊急地震速報
  "$QZQSM,61,9AAF949822800388000030451440C5C82A0108300000000000000010D5D4E0C*7A", // 震源
  "$QZQSM,61,53AF9C98228001822CB25AE775A8D4CA854AB8000000000000000011418F98C*0F", // 震度
  "$QZQSM,61,C6AFAC98228001E8F67C30453960114E620453BE0000000000000011F29A298*03", // 津波
  "$QZQSM,61,C6AFAC982C8001E8F67C30593960164E620593BBC164EF80000000102C57BD0*72", // 津波
  "$QZQSM,61,C6AFAC983180019C00002063396018CE620633BBC18CEF800000001090E7374*0D", // 津波
  "$QZQSM,61,C6AFC498450001845341F783E0F10910421230200000000000000010CBEDD04*7D", // 火山
  "$QZQSM,61,9AAFCC9845000184523EE4C1F078261220813091810000000000001148A4C18*07", // 降灰
  "$QZQSM,61,C6AFCC984A000184A43EE541F0782A1220813091811183E0F000001252DAFDC*76", // 降灰
  "$QZQSM,61,C6AFCC984A000184A43EE8C2441046123023307C1E198488200000131FD48E0*08", // 降灰
  "$QZQSM,61,9AAFCC984A000184A43EECC24604860F83C430910421848C080000139338198*73", // 降灰
  "$QZQSM,61,53AFCC984A000184A43EF4C1F078A61220853091813183E0F000001033AB510*04", // 降灰
  "$QZQSM,61,C6AFCC984A000184A43EF8C24410C61230200000000000000000001091888FC*06", // 降灰
  "$QZQSM,61,C6AFD498518001113880115F901186A011ADB011D4C011FBD0000012A2FD7E4*7B", // 気象
  "$QZQSM,61,9AAFD4985180011222E0B93880B95F90B986A0B9ADB0B9D4C00000130AD84F8*7A", // 気象
  "$QZQSM,61,53AFD498518001B9FBD0BA22E0000000000000000000000000000013AE90114*78", // 気象
  "$QZQSM,61,C6AFDC9851800160A8F55286000000000000000000000000000000103DACAA0*7B", // 洪水
  "$QZQSM,61,C6AFDC98590000E0A8F5528600000000000000000000000000000012F87BD74*02", // 洪水
];

const list = reactive(items.map(parse));
const selectIndex = ref(0);
const select = computed(() => {
  const item = list[selectIndex.value];
  item.body = item.body?.replace(/\n/g, "<br>");
  return item;
});
</script>

<template>
  <v-layout>
    <v-app-bar app>
      <v-toolbar-title>災危通報</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer fixed>
      <v-list nav class="list">
        <v-list-item class="list_item py-4" :key="index" v-for="(value, index) in list" :value="index"
        :title="value.category?.string" :subtitle="value.nmea" :active="index === selectIndex"
        @click="selectIndex = index"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="fluid d-flex flex-wrap list">
        <v-card>
          <v-card-title>{{ select.category?.string }}</v-card-title>
          <v-card-subtitle>{{ select.report_time }}</v-card-subtitle>
          <v-card-subtitle>{{ select.nmea }}</v-card-subtitle>
          <v-card-text v-html="select.body"></v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>

<style lang="scss">
</style>
