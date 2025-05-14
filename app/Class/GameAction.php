<?php

namespace App\Class;

use Illuminate\Http\Request;

/**
 * An action which can be called through different means.
 */
class GameAction {
    public function __construct(
        public string $name,
        public mixed $action,
    ) {}

    /**
     * Executes this game action using data from a http request.
     * 
     * @throws \ReflectionException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function doUsingRequest(Request $request, GameState $gameState): array {
        $functionReflection = new \ReflectionFunction($this->action);

        $validationRules = [];
        foreach ($functionReflection->getParameters() as $functionParameter) {
            $rule = [
                $functionParameter->getType()->allowsNull() ? 'nullable' : 'required',
            ];

            switch ($functionParameter->getType()->__toString()) {
                case 'string':
                    $rule[] = 'string';
                    continue;
                case 'int':
                    $rule[] = 'numeric';
                    continue;
                case 'bool':
                    $rule[] = 'boolean';
                    continue;
                case 'array':
                    $rule[] = 'array';
                    continue;
            }

            $validationRules[] = $rule;
        }

        $body = $request->validate($validationRules);

        $func = $this->action;
        $result = $func($gameState, ...array_values($body));

        return $result;
    }
}