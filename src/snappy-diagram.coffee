class @SnappyDiagram
  constructor: (@options = {}) ->
    @cellCount = 0
    @rowCount = 0
    @cells = []
    @connectors = []

    defaults =
      width: 1000
      height: 500
      cellSpacing: 10
      boxRadius: 5
      markerWidth: 7
      markerHeight: 10

    for key, value of defaults
      @options[key] = value unless @options[key]?

    @snap = Snap(@options.width, @options.height).attr(class: 'snappy-diagram')
    @markerEnd = @triangleMarker(@options.markerWidth, @options.markerHeight)
    @markerStart = @triangleMarker(@options.markerWidth, @options.markerHeight, true)

  addBox: (cellX, cellY, options = {}) ->           @addCell SnappyBox, cellX, cellY, options
  addParallelogram: (cellX, cellY, options = {}) -> @addCell SnappyParallelogram, cellX, cellY, options
  addCircle: (cellX, cellY, options = {}) ->        @addCell SnappyCircle, cellX, cellY, options
  addEllipse: (cellX, cellY, options = {}) ->       @addCell SnappyEllipse, cellX, cellY, options

  addCell: (cellClass, cellX, cellY, options = {}) ->
    @cellCount = Math.max cellX + 1, @cellCount
    @rowCount = Math.max cellY + 1, @rowCount
    @cells[cellX] = [] unless @cells[cellX]?

    cell = new cellClass(@, cellX, cellY, options)
    @cells[cellX].push cell
    cell

  addConnector: (cellStart, cellEnd, options = {}) ->
    connector = new SnappyConnector(@, cellStart, cellEnd, options)
    @connectors.push connector
    connector

  draw: ->
    @setDimensions()
    @drawCells()
    @drawConnectors()

  setDimensions: ->
    @cellWidth = @options.width / @cellCount
    @cellHeight = @options.height / @rowCount

  drawCells: ->
    @setDimensions()
    for row in @cells
      if row?
        cell.draw() for cell in row

  drawConnectors: ->
    @setDimensions()
    connector.draw() for connector in @connectors

  triangleMarker: (width, height, reverse = false) ->
    connectorPathString = "M 0 0 L #{height} #{width / 2} L 0 #{width} z"
    path = @snap.path(connectorPathString)
    path = path.transform('r180') if reverse
    path = path.marker(0, 0, height, width, (if reverse then 1 else height), width / 2)
    path

  inlineCss: ->
    # when running locally, Chrome has to be started with the '--allow-file-access-from-files' parameter for this to work,
    # otherwise the css rules in external stylesheets cannot be read (security policy)
    for stylesheet in document.styleSheets
      if stylesheet.href?
        name = stylesheet.href.split('/')
        if name[name.length - 1] == 'snappy-diagram.css'
          for rule in stylesheet.cssRules || stylesheet.rules || []
            element.style.cssText += rule.style.cssText for element in document.querySelectorAll(rule.selectorText)
          break

  export: ->
    # inline all CSS, as external css rules are ignored
    @inlineCss()

    # canvas: IE9+, btoa: IE10+
    canvas = document.createElement 'canvas'
    svgImage = new Image()
    svgImage.src = "data:image/svg+xml;base64,#{btoa(@snap.node.outerHTML)}"
    svgImage.onload = ->
      canvas.width = svgImage.width
      canvas.height = svgImage.height
      canvas.getContext('2d').drawImage(svgImage, 0, 0)

      link = document.createElement 'a'
      link.href = canvas.toDataURL 'image/png'
      link.download = 'snappy-diagram.png'
      link.click()