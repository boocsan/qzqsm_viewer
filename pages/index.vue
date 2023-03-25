<script setup lang="ts">
import { getBinaryString } from "~/plugins/string_converter";
import { parse, verifyChecksum } from "~/plugins/qzqsm_parser";

const sentence = "$QZQSM,57,9aac8898960003240000312c05377c5ac00001000000000100000012ff02f88*71";

const qzqsm = ref(sentence);
const checksum = ref(verifyChecksum(sentence));
const binary = ref(getBinaryString(sentence.split("*")[0].split(",")[2]));

const parsed = parse(sentence);

const body = parse(sentence).body;
</script>

<template>
  <div>qzqsm: {{ qzqsm }}</div>
  <div>parsed: {{ binary }}</div>
  <div>checksum: {{ checksum }}</div>
  <div>parsed: {{ parsed }}</div>
  <pre>body:
{{ body }}</pre>
</template>

<style lang="scss">
div {
  width: 100%;
  word-break: break-all;
}
</style>
