local mp = require("mp")
local utils = require("mp.utils")

local MIN_CROP_SIZE = 8
local HANDLE_TOLERANCE = 10
local HANDLE_SIZE = 5

local RATIOS = {
    { key = "1", name = "自由", w = nil, h = nil },
    { key = "2", name = "1:1",  w = 1,   h = 1   },
    { key = "3", name = "4:3",  w = 4,   h = 3   },
    { key = "4", name = "16:9", w = 16,  h = 9   },
}

local state = {
    active = false,
    img_w = 0,
    img_h = 0,
    osd = nil,
    rect = nil, -- { x1, y1, x2, y2 } in image pixel coordinates
    ratio_idx = 1,
    portrait = false,
    hover = nil, -- "tl","tm","tr","ml","mr","bl","bm","br","inside", or nil
    drag = nil,  -- active drag state table
    prev_window_dragging = nil,
}

local overlay = mp.create_osd_overlay("ass-events")

local function get_magick_path()
    -- ~~home is portable_config/, which sits next to the magick/ folder.
    local config_dir = mp.command_native({ "expand-path", "~~home/" })
    return utils.join_path(config_dir, "../magick/magick.exe")
end

local MAGICK_PATH = get_magick_path()

local function clamp(v, lo, hi)
    if v < lo then return lo end
    if v > hi then return hi end
    return v
end

local function round(v)
    return math.floor(v + 0.5)
end

local function ass_escape(str)
    if not str then return "" end
    str = tostring(str)
    str = str:gsub("\\", "\\\\")
    str = str:gsub("{", "\\{")
    str = str:gsub("}", "\\}")
    str = str:gsub("\r?\n", "\\N")
    return str
end

local function get_active_ratio()
    local r = RATIOS[state.ratio_idx]
    if not r or not r.w or not r.h then
        return nil, "自由"
    end
    if r.w == r.h then
        return 1.0, "1:1"
    end
    if state.portrait then
        return r.h / r.w, string.format("%d:%d", r.h, r.w)
    else
        return r.w / r.h, string.format("%d:%d", r.w, r.h)
    end
end

local function get_min_dims(ratio)
    local min_w = math.min(MIN_CROP_SIZE, state.img_w)
    local min_h = math.min(MIN_CROP_SIZE, state.img_h)
    if not ratio then
        return min_w, min_h
    end
    if ratio >= 1 then
        min_w = math.max(min_w, min_h * ratio)
        min_h = min_w / ratio
    else
        min_h = math.max(min_h, min_w / ratio)
        min_w = min_h * ratio
    end
    if min_w > state.img_w then
        min_w = state.img_w
        min_h = min_w / ratio
    end
    if min_h > state.img_h then
        min_h = state.img_h
        min_w = min_h * ratio
    end
    return min_w, min_h
end

local function get_video_osd_rect()
    local osd = state.osd
    if not osd or not osd.w or not osd.h or osd.w <= 0 or osd.h <= 0 then
        return nil
    end
    local ml = osd.ml or 0
    local mt = osd.mt or 0
    local mr = osd.mr or 0
    local mb = osd.mb or 0
    local vw = osd.w - ml - mr
    local vh = osd.h - mt - mb
    if vw <= 0 or vh <= 0 then
        return nil
    end
    return ml, mt, vw, vh
end

local function img_to_osd(ix, iy)
    local vx, vy, vw, vh = get_video_osd_rect()
    if not vx or state.img_w <= 0 or state.img_h <= 0 then
        return 0, 0
    end
    return vx + (ix / state.img_w) * vw, vy + (iy / state.img_h) * vh
end

local function osd_to_img(ox, oy)
    local vx, vy, vw, vh = get_video_osd_rect()
    if not vx or state.img_w <= 0 or state.img_h <= 0 then
        return 0, 0
    end
    return ((ox - vx) / vw) * state.img_w, ((oy - vy) / vh) * state.img_h
end

local function get_quantized_crop(r)
    if not r then return 0, 0, 0, 0 end
    local x1 = clamp(round(r.x1), 0, state.img_w)
    local y1 = clamp(round(r.y1), 0, state.img_h)
    local x2 = clamp(round(r.x2), 0, state.img_w)
    local y2 = clamp(round(r.y2), 0, state.img_h)
    local min_w = math.min(MIN_CROP_SIZE, state.img_w)
    local min_h = math.min(MIN_CROP_SIZE, state.img_h)
    if x2 - x1 < min_w then
        if x1 + min_w <= state.img_w then
            x2 = x1 + min_w
        else
            x2 = state.img_w
            x1 = math.max(0, x2 - min_w)
        end
    end
    if y2 - y1 < min_h then
        if y1 + min_h <= state.img_h then
            y2 = y1 + min_h
        else
            y2 = state.img_h
            y1 = math.max(0, y2 - min_h)
        end
    end
    return x1, y1, x2 - x1, y2 - y1
end

local function get_handle_positions_osd(r)
    local ox1, oy1 = img_to_osd(r.x1, r.y1)
    local ox2, oy2 = img_to_osd(r.x2, r.y2)
    local omx = (ox1 + ox2) * 0.5
    local omy = (oy1 + oy2) * 0.5
    return {
        tl = { x = ox1, y = oy1 },
        tm = { x = omx, y = oy1 },
        tr = { x = ox2, y = oy1 },
        ml = { x = ox1, y = omy },
        mr = { x = ox2, y = omy },
        bl = { x = ox1, y = oy2 },
        bm = { x = omx, y = oy2 },
        br = { x = ox2, y = oy2 },
    }, ox1, oy1, ox2, oy2
end

local HANDLE_ORDER = { "tl", "tr", "bl", "br", "tm", "bm", "ml", "mr" }

local function hit_test(ox, oy)
    if not state.rect then
        return nil
    end
    local handles, ox1, oy1, ox2, oy2 = get_handle_positions_osd(state.rect)
    local best_handle = nil
    local best_dist_sq = HANDLE_TOLERANCE * HANDLE_TOLERANCE
    for _, name in ipairs(HANDLE_ORDER) do
        local h = handles[name]
        local dx = ox - h.x
        local dy = oy - h.y
        local d2 = dx * dx + dy * dy
        if d2 <= best_dist_sq then
            best_dist_sq = d2
            best_handle = name
        end
    end
    if best_handle then
        return best_handle
    end
    if ox >= ox1 and ox <= ox2 and oy >= oy1 and oy <= oy2 then
        return "inside"
    end
    return nil
end

local function ass_rect(x1, y1, x2, y2, style)
    return string.format(
        "{\\an7\\pos(0,0)%s\\p1}m %d %d l %d %d %d %d %d %d{\\p0}",
        style,
        round(x1), round(y1),
        round(x2), round(y1),
        round(x2), round(y2),
        round(x1), round(y2)
    )
end

local function render()
    if not state.active then
        overlay:remove()
        return
    end
    local osd = state.osd
    if not osd or not osd.w or not osd.h or osd.w <= 0 or osd.h <= 0 then
        return
    end
    local vx, vy, vw, vh = get_video_osd_rect()
    if not vx then
        return
    end

    overlay.res_x = osd.w
    overlay.res_y = osd.h

    local lines = {}
    local W, H = osd.w, osd.h

    if state.rect then
        local handles, ox1, oy1, ox2, oy2 = get_handle_positions_osd(state.rect)
        local rx1 = clamp(round(ox1), 0, W)
        local ry1 = clamp(round(oy1), 0, H)
        local rx2 = clamp(round(ox2), 0, W)
        local ry2 = clamp(round(oy2), 0, H)

        local dim_style = "\\1c&H000000&\\1a&H78&\\bord0\\shad0"
        if ry1 > 0 then
            lines[#lines + 1] = ass_rect(0, 0, W, ry1, dim_style)
        end
        if ry2 < H then
            lines[#lines + 1] = ass_rect(0, ry2, W, H, dim_style)
        end
        if rx1 > 0 and ry2 > ry1 then
            lines[#lines + 1] = ass_rect(0, ry1, rx1, ry2, dim_style)
        end
        if rx2 < W and ry2 > ry1 then
            lines[#lines + 1] = ass_rect(rx2, ry1, W, ry2, dim_style)
        end

        -- Rule-of-thirds grid
        if rx2 - rx1 > 30 and ry2 - ry1 > 30 then
            local g_style = "\\1a&HFF&\\3c&HFFFFFF&\\3a&HB0&\\bord1\\shad0"
            local gx1 = ox1 + (ox2 - ox1) / 3
            local gx2 = ox1 + (ox2 - ox1) * 2 / 3
            local gy1 = oy1 + (oy2 - oy1) / 3
            local gy2 = oy1 + (oy2 - oy1) * 2 / 3
            lines[#lines + 1] = ass_rect(gx1, oy1, gx1, oy2, g_style)
            lines[#lines + 1] = ass_rect(gx2, oy1, gx2, oy2, g_style)
            lines[#lines + 1] = ass_rect(ox1, gy1, ox2, gy1, g_style)
            lines[#lines + 1] = ass_rect(ox1, gy2, ox2, gy2, g_style)
        end

        -- Crop border
        lines[#lines + 1] = ass_rect(
            ox1, oy1, ox2, oy2,
            "\\1a&HFF&\\3c&HFFFFFF&\\3a&H00&\\bord2\\shad0"
        )

        -- 8 handles
        local active_handle = (state.drag and state.drag.mode == "handle" and state.drag.handle) or state.hover
        for _, name in ipairs(HANDLE_ORDER) do
            local h = handles[name]
            local is_hi = (active_handle == name)
            local hs = is_hi and (HANDLE_SIZE + 2) or HANDLE_SIZE
            local fill = is_hi and "\\1c&H00D7FF&\\1a&H00&\\3c&H000000&\\3a&H20&\\bord1.5\\shad0"
                                or "\\1c&HFFFFFF&\\1a&H00&\\3c&H000000&\\3a&H40&\\bord1\\shad0"
            lines[#lines + 1] = ass_rect(h.x - hs, h.y - hs, h.x + hs, h.y + hs, fill)
        end

        -- Dimension label
        local _, _, cw, ch = get_quantized_crop(state.rect)
        local label_text = ass_escape(string.format("%d×%d", cw, ch))
        local lx = clamp(ox1 + 4, 6, math.max(6, W - 90))
        local ly = (oy1 >= 28) and (oy1 - 6) or (oy1 + 22)
        if ly > H - 45 and oy2 - oy1 > 40 then
            ly = oy1 + 22
        end
        lines[#lines + 1] = string.format(
            "{\\an1\\pos(%d,%d)\\fnMicrosoft JhengHei\\fs16\\b1\\1c&HFFFFFF&\\3c&H000000&\\3a&H20&\\bord2\\shad0}%s",
            round(lx), round(ly), label_text
        )
    else
        -- Full window subtle dim when no rectangle is drawn yet
        lines[#lines + 1] = ass_rect(0, 0, W, H, "\\1c&H000000&\\1a&HB0&\\bord0\\shad0")
    end

    -- Bottom hint bar
    local bar_h = 34
    lines[#lines + 1] = ass_rect(0, H - bar_h, W, H, "\\1c&H181818&\\1a&H28&\\bord0\\shad0")

    local _, cur_ratio_label = get_active_ratio()
    local ratio_parts = {}
    for i, r in ipairs(RATIOS) do
        local name = r.name
        if i == state.ratio_idx and r.w and r.h and r.w ~= r.h then
            name = cur_ratio_label
        end
        if i == state.ratio_idx then
            ratio_parts[#ratio_parts + 1] = string.format(
                "{\\1c&H00D7FF&}%s [%s]{\\1c&HFFFFFF&}",
                ass_escape(r.key), ass_escape(name)
            )
        else
            ratio_parts[#ratio_parts + 1] = string.format(
                "%s %s",
                ass_escape(r.key), ass_escape(name)
            )
        end
    end

    local hint = string.format(
        "裁切模式  拖拉:畫框/調整  %s  R 直橫互換  Enter 存檔  Esc 取消   {\\1c&H00D7FF&}目前:[%s]",
        table.concat(ratio_parts, "  "),
        ass_escape(cur_ratio_label)
    )
    lines[#lines + 1] = string.format(
        "{\\an2\\pos(%d,%d)\\fnMicrosoft JhengHei\\fs16\\b1\\1c&HFFFFFF&\\3c&H000000&\\bord1.5\\shad0}%s",
        round(W * 0.5), round(H - 8), hint
    )

    overlay.data = table.concat(lines, "\n")
    overlay:update()
end

local function compute_corner_box(ax, ay, mx, my, sx, sy, ratio)
    local min_w, min_h = get_min_dims(ratio)
    if sx == 0 then sx = (mx >= ax) and 1 or -1 end
    if sy == 0 then sy = (my >= ay) and 1 or -1 end

    local max_w = (sx > 0) and (state.img_w - ax) or ax
    local max_h = (sy > 0) and (state.img_h - ay) or ay

    if not ratio then
        local w = clamp( (mx - ax) * sx, min_w, math.max(min_w, max_w) )
        local h = clamp( (my - ay) * sy, min_h, math.max(min_h, max_h) )
        local x1 = (sx > 0) and ax or (ax - w)
        local x2 = (sx > 0) and (ax + w) or ax
        local y1 = (sy > 0) and ay or (ay - h)
        local y2 = (sy > 0) and (ay + h) or ay
        if x1 < 0 then x1 = 0; x2 = math.min(state.img_w, min_w) end
        if x2 > state.img_w then x2 = state.img_w; x1 = math.max(0, state.img_w - min_w) end
        if y1 < 0 then y1 = 0; y2 = math.min(state.img_h, min_h) end
        if y2 > state.img_h then y2 = state.img_h; y1 = math.max(0, state.img_h - min_h) end
        return { x1 = x1, y1 = y1, x2 = x2, y2 = y2 }
    else
        local raw_w = math.max(0, (mx - ax) * sx)
        local raw_h = math.max(0, (my - ay) * sy)
        local w = math.max(raw_w, raw_h * ratio)
        local limit_w = math.min(max_w, max_h * ratio)
        w = clamp(w, min_w, math.max(min_w, limit_w))
        local h = w / ratio

        local x1 = (sx > 0) and ax or (ax - w)
        local x2 = (sx > 0) and (ax + w) or ax
        local y1 = (sy > 0) and ay or (ay - h)
        local y2 = (sy > 0) and (ay + h) or ay

        -- If anchor was too close to edge for min_w/min_h, shift into image bounds
        if x1 < 0 then x2 = math.min(state.img_w, x2 - x1); x1 = 0 end
        if x2 > state.img_w then x1 = math.max(0, x1 - (x2 - state.img_w)); x2 = state.img_w end
        if y1 < 0 then y2 = math.min(state.img_h, y2 - y1); y1 = 0 end
        if y2 > state.img_h then y1 = math.max(0, y1 - (y2 - state.img_h)); y2 = state.img_h end
        return { x1 = x1, y1 = y1, x2 = x2, y2 = y2 }
    end
end

local function compute_edge_box(handle, start_rect, ix, iy, ratio)
    local min_w, min_h = get_min_dims(ratio)
    local r = { x1 = start_rect.x1, y1 = start_rect.y1, x2 = start_rect.x2, y2 = start_rect.y2 }

    if not ratio then
        if handle == "ml" then
            r.x1 = clamp(ix, 0, r.x2 - min_w)
        elseif handle == "mr" then
            r.x2 = clamp(ix, r.x1 + min_w, state.img_w)
        elseif handle == "tm" then
            r.y1 = clamp(iy, 0, r.y2 - min_h)
        elseif handle == "bm" then
            r.y2 = clamp(iy, r.y1 + min_h, state.img_h)
        end
        return r
    end

    if handle == "ml" or handle == "mr" then
        local ax = (handle == "ml") and r.x2 or r.x1
        local sx = (handle == "ml") and -1 or 1
        local cy = (r.y1 + r.y2) * 0.5
        local max_w_x = (sx > 0) and (state.img_w - ax) or ax
        local max_w_y = state.img_h * ratio
        local max_w = math.min(max_w_x, max_w_y)
        local raw_w = math.max(0, (ix - ax) * sx)
        local w = clamp(raw_w, min_w, math.max(min_w, max_w))
        local h = w / ratio
        local y1 = cy - h * 0.5
        local y2 = cy + h * 0.5
        if y1 < 0 then
            y2 = math.min(state.img_h, y2 - y1)
            y1 = 0
        elseif y2 > state.img_h then
            y1 = math.max(0, y1 - (y2 - state.img_h))
            y2 = state.img_h
        end
        local x1 = (sx > 0) and ax or (ax - w)
        local x2 = (sx > 0) and (ax + w) or ax
        if x1 < 0 then x2 = math.min(state.img_w, x2 - x1); x1 = 0 end
        if x2 > state.img_w then x1 = math.max(0, x1 - (x2 - state.img_w)); x2 = state.img_w end
        return { x1 = x1, y1 = y1, x2 = x2, y2 = y2 }
    else
        local ay = (handle == "tm") and r.y2 or r.y1
        local sy = (handle == "tm") and -1 or 1
        local cx = (r.x1 + r.x2) * 0.5
        local max_h_y = (sy > 0) and (state.img_h - ay) or ay
        local max_h_x = state.img_w / ratio
        local max_h = math.min(max_h_y, max_h_x)
        local raw_h = math.max(0, (iy - ay) * sy)
        local h = clamp(raw_h, min_h, math.max(min_h, max_h))
        local w = h * ratio
        local x1 = cx - w * 0.5
        local x2 = cx + w * 0.5
        if x1 < 0 then
            x2 = math.min(state.img_w, x2 - x1)
            x1 = 0
        elseif x2 > state.img_w then
            x1 = math.max(0, x1 - (x2 - state.img_w))
            x2 = state.img_w
        end
        local y1 = (sy > 0) and ay or (ay - h)
        local y2 = (sy > 0) and (ay + h) or ay
        if y1 < 0 then y2 = math.min(state.img_h, y2 - y1); y1 = 0 end
        if y2 > state.img_h then y1 = math.max(0, y1 - (y2 - state.img_h)); y2 = state.img_h end
        return { x1 = x1, y1 = y1, x2 = x2, y2 = y2 }
    end
end

local function refit_rect_to_ratio()
    if not state.rect then return end
    local ratio = get_active_ratio()
    if not ratio then return end

    local r = state.rect
    local cur_w = r.x2 - r.x1
    local cur_h = r.y2 - r.y1
    local cx = (r.x1 + r.x2) * 0.5
    local cy = (r.y1 + r.y2) * 0.5

    local area = math.max(1, cur_w * cur_h)
    local target_w = math.sqrt(area * ratio)
    local min_w, _ = get_min_dims(ratio)
    local max_w = math.min(state.img_w, state.img_h * ratio)

    local w = clamp(target_w, min_w, max_w)
    local h = w / ratio

    local x1 = cx - w * 0.5
    local y1 = cy - h * 0.5
    x1 = clamp(x1, 0, math.max(0, state.img_w - w))
    y1 = clamp(y1, 0, math.max(0, state.img_h - h))

    state.rect = {
        x1 = x1,
        y1 = y1,
        x2 = x1 + w,
        y2 = y1 + h,
    }
end

local function update_drag(ox, oy)
    local d = state.drag
    if not d then return end
    local ix, iy = osd_to_img(ox, oy)
    local ratio = get_active_ratio()

    if d.mode == "new" then
        local ax = clamp(d.ax, 0, state.img_w)
        local ay = clamp(d.ay, 0, state.img_h)
        local sx = (ix >= ax) and 1 or -1
        local sy = (iy >= ay) and 1 or -1
        state.rect = compute_corner_box(ax, ay, ix, iy, sx, sy, ratio)
    elseif d.mode == "move" then
        local sr = d.start_rect
        local w = sr.x2 - sr.x1
        local h = sr.y2 - sr.y1
        local dx = ix - d.start_ix
        local dy = iy - d.start_iy
        local nx1 = clamp(sr.x1 + dx, 0, math.max(0, state.img_w - w))
        local ny1 = clamp(sr.y1 + dy, 0, math.max(0, state.img_h - h))
        state.rect = {
            x1 = nx1,
            y1 = ny1,
            x2 = nx1 + w,
            y2 = ny1 + h,
        }
    elseif d.mode == "handle" then
        local hname = d.handle
        local sr = d.start_rect
        if hname == "tl" then
            state.rect = compute_corner_box(sr.x2, sr.y2, ix, iy, -1, -1, ratio)
        elseif hname == "tr" then
            state.rect = compute_corner_box(sr.x1, sr.y2, ix, iy, 1, -1, ratio)
        elseif hname == "bl" then
            state.rect = compute_corner_box(sr.x2, sr.y1, ix, iy, -1, 1, ratio)
        elseif hname == "br" then
            state.rect = compute_corner_box(sr.x1, sr.y1, ix, iy, 1, 1, ratio)
        else
            state.rect = compute_edge_box(hname, sr, ix, iy, ratio)
        end
    end
end

local function on_mouse_pos(_, pos)
    if not state.active or not pos or not pos.x or not pos.y then
        return
    end
    if not get_video_osd_rect() then
        return
    end

    if state.drag then
        update_drag(pos.x, pos.y)
        render()
    else
        local new_hover = hit_test(pos.x, pos.y)
        if new_hover ~= state.hover then
            state.hover = new_hover
            render()
        end
    end
end

-- Size of the image as shown (after EXIF rotation), which is also the space
-- magick -auto-orient crops in. dwidth/dheight do not include the rotation
-- when the VO rotates the image itself, so swap them for 90/270.
local function get_display_size()
    local p = mp.get_property_native("video-out-params")
    if not p or not p.dw or not p.dh then
        return nil, nil
    end
    if (p.rotate or 0) % 180 == 90 then
        return p.dh, p.dw
    end
    return p.dw, p.dh
end

local function on_osd_dimensions(_, val)
    state.osd = val
    if state.active then
        local dwidth, dheight = get_display_size()
        if dwidth and dheight and dwidth > 0 and dheight > 0 then
            state.img_w = dwidth
            state.img_h = dheight
        end
        render()
    end
end

local function on_mouse_btn(tbl)
    if not state.active then return end
    if not get_video_osd_rect() then return end

    local event = tbl and tbl.event
    local pos = mp.get_property_native("mouse-pos")
    local ox = (pos and pos.x) or 0
    local oy = (pos and pos.y) or 0

    if event == "down" or event == "press" then
        local target = hit_test(ox, oy)
        local ix, iy = osd_to_img(ox, oy)

        if target and target ~= "inside" and state.rect then
            state.drag = {
                mode = "handle",
                handle = target,
                start_rect = {
                    x1 = state.rect.x1,
                    y1 = state.rect.y1,
                    x2 = state.rect.x2,
                    y2 = state.rect.y2,
                },
            }
        elseif target == "inside" and state.rect then
            state.drag = {
                mode = "move",
                start_ix = ix,
                start_iy = iy,
                start_rect = {
                    x1 = state.rect.x1,
                    y1 = state.rect.y1,
                    x2 = state.rect.x2,
                    y2 = state.rect.y2,
                },
            }
        else
            local ax = clamp(ix, 0, state.img_w)
            local ay = clamp(iy, 0, state.img_h)
            state.drag = {
                mode = "new",
                ax = ax,
                ay = ay,
            }
            update_drag(ox, oy)
        end
        render()
    elseif event == "up" then
        if state.drag then
            update_drag(ox, oy)
            state.drag = nil
            state.hover = hit_test(ox, oy)
            render()
        end
    end
end

local function set_ratio(idx)
    if not state.active then return end
    state.ratio_idx = idx
    refit_rect_to_ratio()
    render()
end

local function toggle_orientation()
    if not state.active then return end
    state.portrait = not state.portrait
    refit_rect_to_ratio()
    render()
end

local function file_exists(path)
    if utils.file_info then
        if utils.file_info(path) ~= nil then
            return true
        end
    end
    local f = io.open(path, "rb")
    if f then
        f:close()
        return true
    end
    return false
end

local function get_unique_output_path(in_path)
    local dir, filename = utils.split_path(in_path)
    local base = filename:match("^(.*)%.[^%.]+$") or filename
    local first = utils.join_path(dir, base .. "_crop.jpg")
    if not file_exists(first) then
        return first, base .. "_crop.jpg"
    end
    local idx = 2
    while true do
        local name = string.format("%s_crop_%d.jpg", base, idx)
        local candidate = utils.join_path(dir, name)
        if not file_exists(candidate) then
            return candidate, name
        end
        idx = idx + 1
    end
end

local leave_crop_mode

local function save_crop()
    if not state.active then return end
    if not state.rect then
        mp.osd_message("請先拖拉畫出裁切範圍", 2)
        return
    end

    local in_path = mp.get_property_native("path")
    if not in_path or in_path == "" then
        mp.osd_message("無法取得檔案路徑", 3)
        return
    end

    local x, y, w, h = get_quantized_crop(state.rect)
    if w < MIN_CROP_SIZE or h < MIN_CROP_SIZE then
        mp.osd_message("裁切範圍過小", 2)
        return
    end

    local out_path, out_name = get_unique_output_path(in_path)
    local crop_geom = string.format("%dx%d+%d+%d", w, h, x, y)

    local args = {
        MAGICK_PATH,
        in_path,
        "-auto-orient",
        "-background", "white",
        "-alpha", "remove",
        "-alpha", "off",
        "-crop", crop_geom,
        "+repage",
        "-sampling-factor", "4:4:4",
        "-quality", "95",
        out_path,
    }

    local res = mp.command_native({
        name = "subprocess",
        args = args,
        playback_only = false,
        capture_stdout = true,
        capture_stderr = true,
    })

    if res and res.status == 0 and not res.error_string then
        leave_crop_mode()
        mp.osd_message("已存：" .. out_name, 3)
    else
        local err_msg = ""
        if res and res.stderr and res.stderr ~= "" then
            err_msg = res.stderr:match("^[^\r\n]+") or res.stderr
        elseif res and res.error_string and res.error_string ~= "" then
            err_msg = res.error_string
        else
            err_msg = "未知錯誤"
        end
        mp.osd_message("存檔失敗：" .. err_msg, 4)
    end
end

local BINDINGS = {
    { key = "ESC",           name = "crop-cancel", fn = function() leave_crop_mode() end },
    { key = "ENTER",         name = "crop-save",   fn = save_crop },
    { key = "KP_ENTER",      name = "crop-save2",  fn = save_crop },
    { key = "1",             name = "crop-r1",     fn = function() set_ratio(1) end },
    { key = "2",             name = "crop-r2",     fn = function() set_ratio(2) end },
    { key = "3",             name = "crop-r3",     fn = function() set_ratio(3) end },
    { key = "4",             name = "crop-r4",     fn = function() set_ratio(4) end },
    { key = "r",             name = "crop-rot-l",  fn = toggle_orientation },
    { key = "R",             name = "crop-rot-u",  fn = toggle_orientation },
    { key = "MBTN_LEFT",     name = "crop-mbtn",   fn = on_mouse_btn, opts = { complex = true } },
    { key = "MBTN_LEFT_DBL", name = "crop-mdbl",   fn = function() end },
}

leave_crop_mode = function()
    if not state.active then return end
    state.active = false
    state.drag = nil
    state.hover = nil
    state.rect = nil

    overlay:remove()

    mp.unobserve_property(on_mouse_pos)
    mp.unobserve_property(on_osd_dimensions)

    for _, b in ipairs(BINDINGS) do
        mp.remove_key_binding(b.name)
    end

    if state.prev_window_dragging ~= nil then
        mp.set_property_native("window-dragging", state.prev_window_dragging)
        state.prev_window_dragging = nil
    end
end

local function enter_crop_mode()
    local track = mp.get_property_native("current-tracks/video")
    local is_image = track and track.image and not track.albumart
    local dwidth, dheight = get_display_size()

    if not is_image or not dwidth or not dheight or dwidth <= 0 or dheight <= 0 then
        mp.osd_message("裁切只支援圖片", 2)
        return
    end

    state.active = true
    state.img_w = dwidth
    state.img_h = dheight
    state.rect = nil
    state.drag = nil
    state.hover = nil
    state.osd = mp.get_property_native("osd-dimensions")

    state.prev_window_dragging = mp.get_property_native("window-dragging")
    mp.set_property_native("window-dragging", false)

    for _, b in ipairs(BINDINGS) do
        mp.add_forced_key_binding(b.key, b.name, b.fn, b.opts)
    end

    mp.observe_property("mouse-pos", "native", on_mouse_pos)
    mp.observe_property("osd-dimensions", "native", on_osd_dimensions)

    render()
end

local function toggle_crop_mode()
    if state.active then
        leave_crop_mode()
    else
        enter_crop_mode()
    end
end

mp.register_event("end-file", function()
    if state.active then
        leave_crop_mode()
    end
end)

mp.register_event("start-file", function()
    if state.active then
        leave_crop_mode()
    end
end)

mp.add_key_binding("c", "toggle-crop", toggle_crop_mode)
