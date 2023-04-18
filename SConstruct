from SCons.Script import (
    AddOption,
    Command,
    Default,
    GetOption,
)

AddOption(
    '--dev',
    action  = 'store_true',
    help    = 'installation prefix',
    default = False,
)

OPTS_esbuild = {
    # 'minify'    : True, # Minified version exports x as Datatable 
    'bundle'    : True,
    'format'    : 'esm',
    'sourcemap' : GetOption('dev'),
    'watch'     : GetOption('dev'),
    'target'    : 'chrome90,firefox90,edge90,safari15',
    'allow-overwrite' : True,
}


def genOpts(**kwargs):
    opts = { **OPTS_esbuild, **kwargs }
    return ' '.join(
        '--' + k + ('' if v is True else '=' + v)
        for k, v in opts.items()
        if v
    )


js = Command(
    'dist/sdt.min.js', # export file for scons
    ['src/index.js'], # source file
    'esbuild {raw} {opts} --outfile={out}'.format(
        raw  = 'src/index.js',
        opts = genOpts(),
        out  = 'dist/sdt.min.js'
    )
)


css = Command(
    'dist/sdt.min.css', # export file for scons
    ['src/style.css'], # source file
    'esbuild --bundle {raw} --minify --outfile={out}'.format(
        raw  = 'src/style.css',
        out  = 'dist/sdt.min.css'
    )
)

css_build = Command('css-build', [css],'echo successfully built')
js_build = Command('js-build', [js],'echo successfully built')
Default('css-build', 'js-build')
