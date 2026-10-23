-- Order the playlist like the Explorer window the file was opened from.
-- Runs once per mpv window: asks Explorer how that folder is sorted, then
-- reorders the playlist (the current file keeps playing). Falls back to
-- mpv's own name order when the folder isn't open or the column is unknown.

local utils = require("mp.utils")

-- Prints "<folder path>|<sort columns>" for every open Explorer window/tab.
local PS = "[Console]::OutputEncoding = [Text.Encoding]::UTF8; "
    .. "foreach ($w in (New-Object -ComObject Shell.Application).Windows()) { "
    .. "try { $w.Document.Folder.Self.Path + '|' + $w.Document.SortColumns } catch {} }"

local KEYS = {
    ["System.DateModified"] = function(info) return info.mtime end,
    ["System.DateCreated"] = function(info) return info.ctime end,
    ["System.Size"] = function(info) return info.size end,
}

local function normalize(dir)
    return dir:gsub("/", "\\"):gsub("\\+$", ""):lower()
end

-- First column of e.g. "prop:-System.DateModified;System.ItemNameDisplay;".
local function find_sort(stdout, dir)
    for line in stdout:gmatch("[^\r\n]+") do
        local path, cols = line:match("^(.*)|(.*)$")
        if path and normalize(path) == dir then
            local desc, prop = cols:match("^prop:(%-?)([^;]+)")
            if prop then
                return prop, desc == "-"
            end
        end
    end
end

local function reorder(order)
    -- order[i] is the current index of the entry that should end up at i.
    local current = {}
    for i = 1, #order do current[i] = i end
    for target, want in ipairs(order) do
        for j = target, #current do
            if current[j] == want then
                if j ~= target then
                    mp.commandv("playlist-move", j - 1, target - 1)
                    table.remove(current, j)
                    table.insert(current, target, want)
                end
                break
            end
        end
    end
end

local function apply(prop, desc)
    local count = mp.get_property_number("playlist-count", 0)
    if count < 2 then return end

    local items = {}
    for i = 1, count do
        items[i] = { index = i, path = mp.get_property("playlist/" .. (i - 1) .. "/filename") }
    end

    local key = KEYS[prop]
    if key then
        for _, item in ipairs(items) do
            local info = utils.file_info(item.path)
            item.key = info and key(info) or 0
        end
        -- Ties keep mpv's name order, like Explorer.
        table.sort(items, function(a, b)
            if a.key ~= b.key then
                if desc then return a.key > b.key end
                return a.key < b.key
            end
            return a.index < b.index
        end)
    elseif prop == "System.ItemNameDisplay" and desc then
        table.sort(items, function(a, b) return a.index > b.index end)
    else
        return -- name ascending is already mpv's order; other columns are not supported
    end

    local order = {}
    for i, item in ipairs(items) do order[i] = item.index end
    reorder(order)
end

local done = false
mp.register_event("file-loaded", function()
    if done then return end
    done = true

    local path = mp.get_property("path")
    if not path or path:find("://") then return end
    local dir = normalize(utils.split_path(utils.join_path(utils.getcwd(), path)))

    mp.command_native_async({
        name = "subprocess",
        args = { "powershell", "-NoProfile", "-NonInteractive", "-Command", PS },
        playback_only = false,
        capture_stdout = true,
    }, function(success, res)
        if not success or res.status ~= 0 then return end
        local prop, desc = find_sort(res.stdout, dir)
        if prop then apply(prop, desc) end
    end)
end)
