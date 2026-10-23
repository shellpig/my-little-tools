-- Left/Right switch files for images and audio, but keep seeking for videos.
-- The mouse wheel zooms images and keeps mpv's default elsewhere.

local function bind(key, name, fn)
    mp.add_forced_key_binding(key, name, fn, { repeatable = true })
end

local function unbind(...)
    for _, name in ipairs({ ... }) do
        mp.remove_key_binding(name)
    end
end

local function update()
    local v = mp.get_property_native("current-tracks/video")
    local is_video = v and not v.image
    local is_image = v and v.image and not v.albumart

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
end

mp.observe_property("current-tracks/video", "native", update)
