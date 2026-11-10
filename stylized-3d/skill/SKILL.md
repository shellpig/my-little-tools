---
name: stylize-3d
description: Turn a vehicle image (or description) into a stylized low-poly 3D model in a chosen built-in style (currently "small-town", Kenney Car Kit look). Use when the user gives a car/truck/bus picture and wants a model in the small-town style, or asks to generate a stylized vehicle GLB.
---

# stylize-3d

The goal is to match the STYLE, not to reproduce the image. The image only decides what the vehicle is, its proportions, colours and features.

Run everything from the `stylized-3d/` folder of the my-little-tools repo. First use needs `npm install` there.

## Steps

1. Read `prompts/vehicle.md` and follow it to look at the image and write a spec JSON. Allowed values are in `schema/vehicle.schema.json`; `examples/` has one spec per body type.
   - Fill `proportions` with the real vehicle's ratios; the style does the exaggeration.
   - Anything visible that is not in the allowed `features` list goes into `unsupported` as `{ "feature", "note" }`. Never invent new feature names.
2. Save the spec as `out/<short-ascii-name>.json`.
3. Generate: `node cli.mjs out/<name>.json --style small-town --out out`
   - Exit code 1 means the spec is invalid; fix the listed fields and re-run.
4. Tell the user where the `.glb` is and relay the report: applied, approximated, skipped. Always mention skipped items.

Do not edit the generator or the style file to make one image fit. If the user wants something the generator cannot make, report it as unsupported.

For a visual check, the user can run `start.bat` and paste the spec into the page at http://localhost:8767/.
