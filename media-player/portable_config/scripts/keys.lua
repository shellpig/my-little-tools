-- Left/Right switch files for images and audio, but keep seeking for videos.
-- The mouse wheel zooms images and keeps mpv's default elsewhere; a zoomed
-- image can be dragged with the left button to look around.

local function bind(key, name, fn)
    mp.add_forced_key_binding(key, name, fn, { repeatable = true })
end

local function unbind(...)
    for _, name in ipairs({ ... }) do
        mp.remove_key_binding(name)
    end
end

local is_image = false
local is_video = false
local eof_time = nil -- when the current video reached its last frame
local crop_active = false -- set by crop.lua, which owns the left button then
local pan = nil -- drag start: mouse position and pan values
local panning_bound = false
-- The left button drags the window for videos/audio, but not on images,
-- where it pans or draws the crop box.
local default_window_dragging = mp.get_property_native("window-dragging")

local function on_pan_button(t)
    if t.event == "down" then
        local p = mp.get_property_native("mouse-pos")
        pan = { mx = p.x, my = p.y,
                x = mp.get_property_number("video-pan-x", 0),
                y = mp.get_property_number("video-pan-y", 0) }
    elseif t.event == "up" then
        pan = nil
    end
end

mp.observe_property("mouse-pos", "native", function(_, p)
    if not pan or not p then return end
    -- video-pan is in fractions of the scaled image, which is what
    -- osd-dimensions measures (margins go negative once it overflows).
    local d = mp.get_property_native("osd-dimensions")
    local w, h = d.w - d.ml - d.mr, d.h - d.mt - d.mb
    if w <= 0 or h <= 0 then return end
    mp.set_property_number("video-pan-x", pan.x + (p.x - pan.mx) / w)
    mp.set_property_number("video-pan-y", pan.y + (p.y - pan.my) / h)
end)

local function update_pan()
    local want = is_image and not crop_active and mp.get_property_number("video-zoom", 0) > 0
    if want and not panning_bound then
        mp.add_forced_key_binding("MBTN_LEFT", "pan-image", on_pan_button, { complex = true })
    elseif not want and panning_bound then
        mp.remove_key_binding("pan-image")
        pan = nil
    end
    panning_bound = want
end

mp.observe_property("video-zoom", "number", update_pan)
mp.observe_property("user-data/crop/active", "bool", function(_, active)
    crop_active = active or false
    update_pan()
end)

-- A finished video stays on its last frame without pausing (keep-open-pause=no),
-- so play/pause there flips pause on: restart from the beginning instead.
-- Presses within a second of the end are ignored.
mp.observe_property("eof-reached", "bool", function(_, eof)
    eof_time = eof and mp.get_time() or nil
end)

mp.observe_property("pause", "bool", function(_, paused)
    if not (paused and is_video and eof_time) then return end
    if mp.get_time() - eof_time >= 1 then
        mp.commandv("seek", "0", "absolute")
    end
    mp.set_property_bool("pause", false)
end)

local function update()
    local v = mp.get_property_native("current-tracks/video")
    is_video = v and not v.image or false
    is_image = v and v.image and not v.albumart or false
    mp.set_property_native("window-dragging", not is_image and default_window_dragging)

    if is_video then
        unbind("prev-file", "next-file")
    else
        bind("LEFT", "prev-file", function() mp.command("playlist-prev") end)
        bind("RIGHT", "next-file", function() mp.command("playlist-next") end)
    end

    if is_image then
        bind("WHEEL_UP", "zoom-in", function() mp.command("add video-zoom 0.1") end)
        bind("WHEEL_DOWN", "zoom-out", function() mp.command("add video-zoom -0.1") end)
    else
        unbind("zoom-in", "zoom-out")
    end
    update_pan()
end

mp.observe_property("current-tracks/video", "native", update)
